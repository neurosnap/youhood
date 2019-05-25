const router = require('express-promise-router')();
const debug = require('debug');
const fetch = require('node-fetch');
const uuid = require('uuid/v4');

const db = require('./db');
const { findOrCreateUser } = require('./user');
const { addPoint } = require('./point');
const { transformSQLToGeoJson } = require('./transform');
const sendNotificationEmail = require('./notification');

const log = debug('router:hood');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';

router.get('/:hoodId', async (req, res) => {
  const hoodId = req.params.hoodId;
  const hood = await findHood(hoodId);
  if (hood.error) {
    return res.status(400).json(hood);
  }

  return res.json(hood);
});

router.get('/:state/:city/all', async (req, res) => {
  const state = req.params.state;
  const city = req.params.city;

  const hoods = await getHoodsByCity(city, state);
  if (hoods.error) {
    return res.status(400).json(hoods);
  }

  const winners = await getHoodWinnerIdsByCity(city, state);
  if (winners.error) {
    return res.status(400).json(winners);
  }

  return res.json({ ...hoods, ...winners });
});

router.get('/:state/:city', async (req, res) => {
  const state = req.params.state;
  const city = req.params.city;

  const hoods = await getHoodWinnersByCity(city, state);
  if (hoods.error) {
    return res.status(400).json(hoods);
  }

  return res.json(hoods);
});

router.post('/save', async (req, res) => {
  log(req.body);
  const connections = req.app.get('connections');

  const data = transformHood(req.body);
  const results = await Promise.all(
    data.map((preparedHood) => createOrUpdateHood(preparedHood)),
  );

  const successHoods = results.filter((res) => res.hood);

  if (connections) {
    const geojson = transformSQLToGeoJson(successHoods.map((res) => res.hood));
    sendAll(Object.values(connections), {
      type: 'got-hoods',
      data: { hoods: geojson },
    });
  }

  const hoods = successHoods.map((res) => ({
    properties: { id: res.hood.id },
  }));

  successHoods.forEach(({ hood }) => {
    const text =
      `id: ${hood.id}\n` +
      `state: ${hood.state}\n` +
      `city: ${hood.city}\n` +
      `name: ${hood.name}\n` +
      `user id: ${hood.hood_user_id}\n` +
      `---`;

    sendNotificationEmail({
      subject: `${hood.name} hood created in ${hood.city}, ${hood.state}`,
      text,
      html: text.replace(/\n/g, '<br />'),
    });
  });

  return res.json({ hoods });
});

function sendAll(connections, msg) {
  for (let i = 0; i < connections.length; i++) {
    const user = connections[i];
    user.send(JSON.stringify(msg));
  }
}

const findHoodWinners = `
  SELECT DISTINCT ON (a.name) a.id
  FROM (
		SELECT n.id, n.name, SUM(COALESCE(vote, 0)) as votes
		FROM neighborhood as n
		LEFT OUTER JOIN vote ON vote.neighborhood_id=n.id
		WHERE city=$1 AND state=$2
		GROUP BY n.id
		ORDER BY n.name asc
	) as a
	ORDER BY a.name, a.votes DESC, a.id
`;

async function getHoodWinnersByCity(city, state) {
  const sql = `
  SELECT hood.id, hood.name, hood.state, hood.city, hood.county, ST_AsGeoJSON(geom) as geom
  FROM neighborhood as hood
  WHERE hood.id IN (${findHoodWinners});
  `;

  const prepared = [city.toLowerCase(), state.toLowerCase()];
  let data;
  try {
    const result = await db.query(sql, prepared);
    data = result.rows;
    if (data.length === 0) {
      return { error: 'No hoods found' };
    }
  } catch (err) {
    log(err);
  }

  const geojson = transformSQLToGeoJson(data);
  return { hoods: geojson };
}

async function getHoodWinnerIdsByCity(city, state) {
  const sql = `
  SELECT hood.id
  FROM neighborhood as hood
  WHERE hood.id IN (${findHoodWinners});
  `;

  const prepared = [city.toLowerCase(), state.toLowerCase()];
  let data;
  try {
    const result = await db.query(sql, prepared);
    data = result.rows;
    if (data.length === 0) {
      return { error: 'No hoods found' };
    }
  } catch (err) {
    log(err);
  }

  const winners = data.map((d) => d.id);
  return { winners };
}

async function updateHood(preparedHood) {
  sql = `
    UPDATE
      neighborhood
    SET
      hood_user_id=$2,
      state=$3,
      city=$4,
      name=$5,
      geom=ST_Multi(ST_GeomFromGeoJSON($6))
    WHERE id=$1
    RETURNING id, hood_user_id, state, city, name, ST_AsGeoJSON(geom) as geom;
  `;

  try {
    const result = await db.query(sql, transformHoodToList(preparedHood));
    log(result);
    return { hood: result.rows[0] };
  } catch (err) {
    log(err);
    return { error: err.message };
  }
}

function transformGeoLookup(addresses) {
  const types = [
    'administrative_area_level_1',
    'locality',
    'country',
    'neighborhood',
  ];
  const typeMap = {
    administrative_area_level_1: 'state',
    locality: 'city',
    country: 'country',
    neighborhood: 'neighborhood',
  };

  const result = { data: addresses };
  addresses[0].address_components.forEach((component) => {
    component.types.forEach((type) => {
      if (types.indexOf(type) >= 0) {
        result[typeMap[type]] = component.short_name;
      }
    });
  });

  return result;
}

async function reverseGeoLookgup(latlng) {
  const latlngStr = [latlng[1], latlng[0]].join(',');
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlngStr}&key=${GOOGLE_API_KEY}`;

  log('LOOKING UP LAT LNG: ', url);
  const result = await fetch(url);
  const json = await result.json();
  return transformGeoLookup(json.results);
}

async function createHood(preparedHood) {
  const point = preparedHood.geometry.coordinates[0][0];
  const lookup = await reverseGeoLookgup(point);
  const sql = `
    INSERT INTO
      neighborhood (id, hood_user_id, name, city, state, country, geom)
    VALUES ($1, $2, $3, $4, $5, $6, ST_Multi(ST_GeomFromGeoJSON($7)))
    RETURNING id, hood_user_id, state, city, name, created_at, updated_at, ST_AsGeoJSON(geom) as geom;
  `;

  try {
    const result = await db.query(sql, [
      preparedHood.id,
      preparedHood.userId,
      preparedHood.name.toLowerCase(),
      lookup.city.toLowerCase(),
      lookup.state.toLowerCase(),
      lookup.country.toLowerCase(),
      preparedHood.geometry,
    ]);
    return { hood: { ...result.rows[0], prevId: preparedHood.prevId } };
  } catch (err) {
    log(err);
    return { error: err.message };
  }
}

async function createOrUpdateHood(preparedHood) {
  const user = await findOrCreateUser(preparedHood.userId);
  if (!user) return;
  const userId = user.user.id;
  const hoodId = preparedHood.id;
  log(preparedHood);

  let hood = await findHood(hoodId);
  if (hood.error) {
    const newHoodId = uuid();
    const newHood = { ...preparedHood, id: newHoodId, prevId: preparedHood.id };
    hood = await createHood(newHood);
    await addPoint({ userId, hoodId: newHoodId, reason: 'AFTER_SAVE_HOOD' });
    return hood;
  }

  await updateHood(preparedHood);
  hood = await findHood(hoodId);
  return hood;
}

function transformHood(data) {
  log(data);
  return data.map((hood) => ({
    id: hood.properties.id,
    userId: hood.properties.userId,
    state: hood.properties.state,
    city: hood.properties.city,
    name: hood.properties.name,
    geometry: hood.geometry,
  }));
}

function transformHoodToList(data) {
  return data.map((hood) => [
    hood.id,
    hood.userId,
    hood.state.toLowerCase(),
    hood.city.toLowerCase(),
    hood.name.toLowerCase(),
    hood.geometry,
  ]);
}

async function findHood(hoodId) {
  const sql = `
    SELECT
      id,
      hood_user_id,
      state,
      county,
      city,
      name,
      created_at,
      updated_at,
      ST_AsGeoJSON(geom) as geom
    FROM
        neighborhood
    WHERE
      id=$1
  `;

  try {
    const result = await db.query(sql, [hoodId]);
    const data = result.rows;
    log(data);
    if (data.length === 0) {
      return { error: `Could not find hood with id ${hoodId}` };
    }

    return { hood: result.rows[0] };
  } catch (err) {
    log(err);
    return { error: err };
  }
}

async function getHoods(socket, city, state) {
  const hoods = await getHoodsByCity(city, state);
  if (hoods.error) {
    return;
  }

  const winners = await getHoodWinnerIdsByCity(city, state);
  if (winners.error) {
    return;
  }

  socket.send(
    JSON.stringify({ type: 'got-hoods', data: { ...hoods, ...winners } }),
  );
}

async function getHoodsByUserId(userId) {
  const sql = `
    SELECT
      id,
      hood_user_id,
      state,
      county,
      city,
      name,
      created_at,
      updated_at,
      ST_AsGeoJSON(geom) as geom
    FROM
      neighborhood
    WHERE
      hood_user_id=$1;
  `;

  let data;
  try {
    const result = await db.query(sql, [userId]);
    data = result.rows;
    if (data.length === 0) {
      return;
    }
  } catch (err) {
    log(err);
  }

  const geojson = transformSQLToGeoJson(data);
  return geojson;
}

async function getHoodsByCity(city, state) {
  const sql = `
    SELECT
      n.id,
      n.hood_user_id,
      state,
      county,
      city,
      name,
      n.created_at,
      updated_at,
      coalesce(SUM(vote), 0) as votes,
      ST_AsGeoJSON(geom) as geom
    FROM
      neighborhood as n
    LEFT OUTER JOIN vote ON vote.neighborhood_id=n.id
    WHERE
      city=$1 AND
      state=$2
    GROUP BY n.id;
  `;

  const prepared = [city.toLowerCase(), state.toLowerCase()];
  let data;
  try {
    const result = await db.query(sql, prepared);
    data = result.rows;
    if (data.length === 0) {
      return { error: 'No hoods found' };
    }
  } catch (err) {
    log(err);
  }

  const geojson = transformSQLToGeoJson(data);
  return { hoods: geojson };
}

module.exports = {
  sendAll,
  getHoods,
  getHoodsByUserId,
  router,
  getHoodWinnerIdsByCity,
  getHoodWinnersByCity,
};
