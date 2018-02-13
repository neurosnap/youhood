const path = require('path');
const webpack = require('webpack');
const { CheckerPlugin, TsConfigPathsPlugin } = require('awesome-typescript-loader');

module.exports = {
  devtool: 'source-map',
  entry: './src/delivery/web/index.ts',
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader',
      exclude: /node_modules/,
    }]
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    plugins: [
      new TsConfigPathsPlugin(),
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
    new CheckerPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
  ]
};
