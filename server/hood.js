const router = require('express-promise-router')();
const debug = require('debug');
const fetch = require('node-fetch');

const db = require('./db');
const { findOrCreateUser } = require('./user');
const { addPoint } = require('./point');

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

router.post('/save', async (req, res, next) => {
  log(req.body);
  const connections = req.app.get('connections');

  const data = transformHood(req.body);
  const results = await Promise.all(
    data.map((preparedHood) => createOrUpdateHood(preparedHood)),
  );

  const successHoods = results.filter((res) => res.hood);

  if (connections) {
    const geojson = transformSQLToGeoJson(successHoods.map((res) => res.hood));
    sendAll(Object.values(connections), { type: 'got-hoods', data: geojson });
  }

  const hoods = successHoods.map((res) => ({
    properties: { id: res.hood.id },
  }));
  res.json({ hoods });
});

function sendAll(connections, msg) {
  for (let i = 0; i < connections.length; i++) {
    const user = connections[i];
    user.send(JSON.stringify(msg));
  }
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
    const result = await db.query(sql, preparedHood);
    log(result);
    return { hood: result.rows[0] };
  } catch (err) {
    log(err);
    return { error: err.message };
  }

  return null;
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
  addresses.map((address) => {
    const foundTypes = address.types.filter((type) => {
      const index = types.indexOf(type);
      return index >= 0;
    });

    foundTypes.forEach((type) => {
      const index = types.indexOf(type);
      const addressType = types[index];
      const components = address.address_components.filter((component) => {
        return component.types[0] === addressType;
      });
      components.forEach((component) => {
        if (component.types[0] === addressType) {
          result[typeMap[addressType]] = component.short_name;
        }
      });
    });
  });

  return result;
}

async function reverseGeoLookgup(latlng) {
  const latlngStr = [latlng[1], latlng[0]].join(',');
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlngStr}&key=${GOOGLE_API_KEY}`;

  const result = await fetch(url);
  const json = await result.json();
  return transformGeoLookup(json.results);
}

async function createHood(preparedHood) {
  const point = preparedHood[5].coordinates[0][0];
  const lookup = await reverseGeoLookgup(point);
  const sql = `
    INSERT INTO
      neighborhood (id, hood_user_id, name, city, state, country, geom)
    VALUES ($1, $2, $3, $4, $5, $6, ST_Multi(ST_GeomFromGeoJSON($7)))
    RETURNING id, hood_user_id, state, city, name, created_at, updated_at, ST_AsGeoJSON(geom) as geom;
  `;

  try {
    const result = await db.query(sql, [
      preparedHood[0],
      preparedHood[1],
      preparedHood[4],
      lookup.city,
      lookup.state,
      lookup.country,
      preparedHood[5],
    ]);
    return { hood: result.rows[0] };
  } catch (err) {
    log(err);
    return { error: err.message };
  }

  return null;
}

async function createOrUpdateHood(preparedHood) {
  const user = await findOrCreateUser(preparedHood[1]);
  if (!user) return;
  const userId = user.user.id;
  const hoodId = preparedHood[0];
  log(preparedHood);

  let hood = await findHood(hoodId);
  if (hood.error) {
    hood = await createHood(preparedHood);
    await addPoint({ userId, hoodId, reason: 'AFTER_SAVE_HOOD' });
    return hood;
  }

  await updateHood(preparedHood);
  hood = await findHood(hoodId);
  return hood;
}

function transformHood(data) {
  log(data);
  return data.map((hood) => [
    hood.properties.id,
    hood.properties.userId,
    hood.properties.state,
    hood.properties.city,
    hood.properties.name,
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

async function getHoods(socket) {
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
  `;

  let data;
  try {
    const result = await db.query(sql);
    data = result.rows;
    if (data.length === 0) {
      return;
    }
  } catch (err) {
    log(err);
  }

  const geojson = transformSQLToGeoJson(data);
  socket.send(JSON.stringify({ type: 'got-hoods', data: geojson }));
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

function transformSQLToGeoJson(sqlResults) {
  const features = sqlResults.map(transformFeaturesToJson);
  return {
    type: 'FeatureCollection',
    features,
  };
}

function transformFeaturesToJson(hood) {
  return {
    type: 'Feature',
    properties: {
      id: hood.id,
      userId: hood.hood_user_id,
      state: hood.state,
      county: hood.county,
      city: hood.city,
      name: hood.name,
      createdAt: hood.created_at,
      updatedAt: hood.updated_at,
    },
    geometry: JSON.parse(hood.geom),
  };
}

module.exports = {
  sendAll,
  getHoods,
  getHoodsByUserId,
  router,
};
