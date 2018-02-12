const router = require('express-promise-router')();
const debug = require('debug');

const db = require('./db');
const { findOrCreateUser } = require('./users');

const log = debug('router:hood');

router.post('/save', async (req, res) => {
  log(req.body);
  const data = transformHood(req.body);
  const results = await Promise.all(
    data.map(
      (preparedHood) => createOrUpdateHood(preparedHood),
    )
  );
  const hoods = results
    .filter((res) => res.hood)
    .map((res) => ({ properties: { id: res.hood.id } }));

  console.log(hoods);
  res.json({ hoods });
});

async function updateHood(preparedHood) {
  sql = `
    UPDATE
      neighborhood
    SET
      hood_user_id=$2,
      state=$3,
      city=$4,
      name=$5,
      geom=ST_Multi(ST_GeomFromGeoJSON($6)))
    WHERE id=$1
    RETURNING id;
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

async function createHood(preparedHood) {
  const sql = `
    INSERT INTO
      neighborhood (id, hood_user_id, state, city, name, geom)
    VALUES ($1, $2, $3, $4, $5, ST_Multi(ST_GeomFromGeoJSON($6)))
    RETURNING id;
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

async function createOrUpdateHood(preparedHood) {
  const user = await findOrCreateUser(preparedHood[1]);
  if (!user) return;
  const hoodId = preparedHood[0];
  log(preparedHood);

  let hood = await findHood(hoodId);
  if (hood.error) {
    hood = await createHood(preparedHood);
    return hood;
  }

  hood = await updateHood(preparedHood);
  return hood;
}

function transformHood(data) {
  log(data);
  return data.map(
    (hood) => [
      hood.properties.id,
      hood.properties.userId,
      hood.properties.state,
      hood.properties.city,
      hood.properties.name,
      hood.geometry,
    ]
  );
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
    log(data);
    if (data.length === 0) {
      return;
    }
  } catch (err) {
    log(err);
  }

  const features = data.map(transformToJson);
  const geojson = {
    type: "FeatureCollection",
    features,
  };
  socket.send(JSON.stringify({ type: 'got-hoods', data: geojson }));
}

function transformToJson(hood) {
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
  getHoods,
  router,
};
