const path = require('path');
const {
  CheckerPlugin,
  TsConfigPathsPlugin,
} = require('awesome-typescript-loader');

const ROOT = path.resolve(__dirname, '..');

module.exports = {
  entry: {
    explore: path.join(ROOT, 'delivery', 'explore', 'index.ts'),
    web: path.join(ROOT, 'delivery', 'web', 'index.ts'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    plugins: [new TsConfigPathsPlugin()],
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.join(ROOT, 'public'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'common',
        },
      },
    },
  },
  plugins: [new CheckerPlugin()],
};
