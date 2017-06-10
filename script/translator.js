function translate(feature) {
  /* eslint-disable no-param-reassign */
  const props = {};

  Object.keys(feature.properties).forEach((key) => {
    props[key.toLowerCase()] = feature.properties[key];
  });

  feature.properties = props;
  feature.properties.user = {
    name: 'Zillow',
    id: '1',
  };
  return feature;
}

module.exports = translate;
