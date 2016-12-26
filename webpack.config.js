var webpack = require('webpack');
var path = require('path');
var nib = require('nib');

var paths = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'build'),
};

module.exports = {
  entry: [
    'babel-polyfill',
    paths.src + '/index.js'
  ],

  output: {
    path: paths.dist,
    filename: 'script.js',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.styl$/,
        loader: 'style!css!stylus',
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
    ],
  },

  stylus: {
    use: [nib()],
  },
};
