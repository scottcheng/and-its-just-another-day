var webpack = require('webpack');
var path = require('path');

var paths = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'build'),
};

module.exports = {
  entry: paths.src + '/script.js',
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
    ],
  },
};
