const path = require('path');
const {
  CheckerPlugin,
  TsConfigPathsPlugin,
} = require('awesome-typescript-loader');

const ROOT = path.resolve(__dirname, '..');

module.exports = {
  entry: path.join(ROOT, 'web', 'index.ts'),
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    plugins: [new TsConfigPathsPlugin()],
  },
  output: {
    filename: 'bundle.js',
    path: path.join(ROOT, 'public'),
  },
  plugins: [new CheckerPlugin()],
};
