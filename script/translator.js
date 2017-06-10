function translate(feature) {
  /* eslint-disable no-param-reassign */
  const props = {};

  Object.keys(feature.properties).forEach((key) => {
    props[key.toLowerCase()] = feature.properties[key];
  });

  feature.properties = props;
  return feature;
}

module.exports = translate;
