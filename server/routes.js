const path = require('path');
const uuid = require('uuid/v4');
const router = require('express-promise-router')();

const db = require('./db');

module.exports = router;

const root = path.join(__dirname, '..');

router.get('/index', async (req, res) => {
  const file = path.join(root, 'public', 'index.html');
  return res.sendFile(file);
});

router.get('/leaflet.css', (req, res) => {
  const file = path.join(root, 'node_modules/leaflet/dist/leaflet.css');
  return res.sendFile(file);
});

router.get('/leaflet.draw.css', (req, res) => {
  const file = path.join(root, 'node_modules/leaflet-draw/dist/leaflet.draw.css');
  return res.sendFile(file);
});

router.get('/images/layers-2x.png', (req, res) => {
  return res.sendFile(path.join(root, 'node_modules/leaflet/dist/images/layers-2x.png'));
});

router.get('/images/spritesheet.svg', (req, res) => {
  return res.sendFile(path.join(root, 'node_modules/leaflet-draw/dist/images/spritesheet.svg'));
});
