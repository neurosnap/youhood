const debug = require('debug');
const router = require('express-promise-router')();

const sendNotificationEmail = require('../notification');
const {
  createOrUpdateHood,
  findHood,
  getHoodsByCity,
  getHoodWinnerIdsByCity,
  getHoodWinnersByCity,
  sendAll,
  transformHood,
} = require('../hood');

const log = debug('hood');

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

module.exports = router;
