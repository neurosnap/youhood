const fs = require('fs');

const translator = require('./translator');

const args = process.argv;

if (args.length < 4) {
  console.error('Must provide two arguments, node extractors.js [data-file.json] [output.json]');
  return;
}

const inFile = args[2];
console.log('data file', inFile);
const outFile = args[3];
console.log('output file', outFile);

const file = fs.readFileSync(inFile);
const json = JSON.parse(file.toString());

const aaFeatures = json
  .features
  .filter((feature) => feature.properties.City.toLowerCase() === 'ann arbor')
  .map((feature) => translator(feature));

const geojson = {
  type: 'FeatureCollection',
  features: aaFeatures,
};

fs.writeFile(outFile, JSON.stringify(geojson, null, 2), (err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('file was saved!');
});
