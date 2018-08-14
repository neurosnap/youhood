const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const common = require('./common');

const ROOT = path.resolve(__dirname, '..');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(ROOT, 'public'),
    compress: true,
    port: 8000,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              plugins: ['react-hot-loader/babel'],
            },
          },
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: path.join(ROOT, 'tsconfig.dev.json'),
              useBabel: true,
              useCache: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY),
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
  ],
});
