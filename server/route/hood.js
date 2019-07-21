const debug = require('debug');
const router = require('express-promise-router')();

const {
  findHood,
  getHoodWinnersByCity,
  searchForHoodsByCity,
  saveHood,
} = require('../hood');

const log = debug('router:hood');

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
  const results = await searchForHoodsByCity(state, city);
  if (results.error) {
    return res.status(400).json(results);
  }

  return res.json(results);
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
  const results = await saveHood(req.body, connections);
  return res.json(results);
});

module.exports = router;
