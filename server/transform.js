function transformSQLToGeoJson(sqlResults = []) {
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
      votes: hood.votes ? parseInt(hood.votes, 10) : 0,
    },
    geometry: JSON.parse(hood.geom),
  };
}

module.exports = {
  transformFeaturesToJson,
  transformSQLToGeoJson,
};
