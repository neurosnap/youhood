import { call, task, all } from 'cofx';
import { promisify } from 'util';
import * as fs from 'fs';
import * as childProcess from 'child_process';
import * as uuid from 'uuid/v4';
import { Extract } from 'unzip';
// @ts-ignore
import * as db from '../server/db';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const exec = promisify(childProcess.exec);
const stat = promisify(fs.stat);

if (process.argv.length < 4) {
  console.error(
    'Must provide input and output directories: zillow.ts inputDir outputDir',
  );
  process.exit();
}

const inputDir = process.argv[2];
const outputDir = process.argv[3];

task(run, inputDir, outputDir).then((result) => {
  console.log('DONE', result);
});

interface FileParts {
  name: string;
  type: string;
}

const getFileParts = (fileName: string): FileParts => {
  const dots = fileName.split('.');
  return {
    name: dots[0],
    type: dots[dots.length - 1],
  };
};

const isZip = (fileName: string) => {
  const fileParts = getFileParts(fileName);
  return fileParts.type === 'zip';
};

function* unzip(fileNames: string[], inDir: string, outDir: string) {
  const mapper = (fileName: string) => call(unzipFile, fileName, inDir, outDir);
  const paths = yield all(fileNames.map(mapper));
  return paths.filter(Boolean);
}

function* unzipFile(fileName: string, inDir: string, outDir: string) {
  const fileParts = getFileParts(fileName);
  const inputPath = `${inDir}/${fileName}`;
  const outputPath = `${outDir}/${fileParts.name}`;
  try {
    yield call(stat, outputPath);
    console.log(`${outputPath} already exists, skipping`);
    return outputPath;
  } catch (err) {}

  return new Promise((resolve) => {
    const stream = fs
      .createReadStream(inputPath)
      .pipe(Extract({ path: outputPath }));
    stream
      .on('close', () => {
        resolve(outputPath);
      })
      .on('error', (error) => {
        console.log(error);
      });
  });
}

interface RunResult {
  files: string[];
  error: Error | null;
}

function* findZipFiles(dir: string) {
  try {
    const contents = yield call(readdir, dir);
    const zipFiles = contents.filter(isZip);
    return { files: zipFiles, error: null } as RunResult;
  } catch (error) {
    return { files: [], error } as RunResult;
  }
}

function* convertShapeToGeoJson(path: string) {
  const finalPath = path.split('/');
  const fileName = `${path}/${finalPath[finalPath.length - 1]}`;
  const geojsonFile = `${fileName}.geojson`;
  try {
    yield call(stat, geojsonFile);
    console.log(`${geojsonFile} exists, skipping`);
    return geojsonFile;
  } catch (err) {}

  const cmd = `ogr2ogr -f "GeoJSON" ${geojsonFile} ${fileName}.shp`;
  try {
    yield call(exec, cmd);
  } catch (err) {
    console.log(err);
  }

  return geojsonFile;
}

function* findUser(email: string) {
  const sql = 'SELECT * FROM hood_user WHERE email=$1';

  try {
    const result = yield call(db.query, sql, [email]);
    const user = result.rows[0];
    if (!user) {
      throw new Error('Could not find user');
    }
    return { user };
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
}

function* findOrCreateZillowUser() {
  const email = 'zillow@youhood.io';
  let user = yield call(findUser, email);

  if (user.error) {
    const passhash =
      '$2b$10$TC9mWw2bEsvHal1Q5teHN.gXPflrBBrjWy7x2LjwJ0jrRDkTgbBwG';
    try {
      const result = yield call(
        db.query,
        'INSERT INTO hood_user (id, email, passhash) VALUES($1, $2, $3) RETURNING *;',
        [uuid(), email, passhash],
      );
      user = { user: result.rows[0] };
    } catch (err) {
      console.log(err);
    }
  }

  return user.user.id;
}

function* runEtl(geoJsonFiles: string[]) {
  const userId = yield call(findOrCreateZillowUser);
  console.log('USER ID', userId);

  const features: GeoJSON.Feature[][] = yield all(
    geoJsonFiles.map((fileName) => call(extractGeoJson, fileName)),
  );
  const flatten = (acc: GeoJSON.Feature[], feats: GeoJSON.Feature[]) => [
    ...acc,
    ...feats,
  ];
  const flattenFeatures = features.filter(Boolean).reduce(flatten, []);
  yield all(
    flattenFeatures.map((feature) => call(loadGeoJson, feature, userId)),
  );

  yield call(db.end);
}

function* extractGeoJson(fileName: string) {
  try {
    const file = yield call(readFile, fileName);
    const json = JSON.parse(file.toString());
    return json.features;
  } catch (err) {
    console.log(err);
  }
}

function* loadGeoJson(hood: GeoJSON.Feature, userId: string) {
  const geometry = hood.geometry;
  if (!hood.properties) {
    return;
  }
  const state = hood.properties.State.toLowerCase();
  const city = hood.properties.City.toLowerCase();
  const county = hood.properties.County.toLowerCase();
  const name = hood.properties.Name.toLowerCase();
  const country = 'us';

  try {
    const result = yield call(
      db.query,
      'SELECT id FROM neighborhood WHERE name=$1 AND city=$2 AND state=$3;',
      [name, city, state],
    );

    if (result.rows.length > 0) {
      console.log(`Already found ${name}, ${city}, ${state} hood, skipping`);
      return;
    }
  } catch (err) {}

  const sql = `
    INSERT INTO
      neighborhood (id, hood_user_id, name, city, county, state, country, geom)
    VALUES ($1, $2, $3, $4, $5, $6, $7, ST_Multi(ST_GeomFromGeoJSON($8)));
  `;

  const preparedHood = [
    uuid(),
    userId,
    name,
    city,
    county,
    state,
    country,
    geometry,
  ];

  try {
    console.log(`Adding ${name}, ${city}, ${state} to hoods`);
    yield call(db.query, sql, preparedHood);
  } catch (err) {
    console.log(err);
  }
}

function* run(inDir: string, outDir: string) {
  const result = yield call(findZipFiles, inDir);
  if (result.error) {
    console.log(result.error);
    return;
  }

  const paths = yield call(unzip, result.files, inDir, outDir);
  const mapper = (path: string) => call(convertShapeToGeoJson, path);
  const geojsonFiles = yield all(paths.map(mapper));

  console.log('---');
  console.log('Running ETL script');
  console.log('---');
  yield call(runEtl, geojsonFiles);
}
