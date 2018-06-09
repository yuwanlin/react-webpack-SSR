const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackBase = require('./webpack.config.base');

module.exports = webpackMerge(webpackBase, {
  target: 'node',
  entry: {
    app: path.join(__dirname, '../client/server-entry.js')
  },
  output: {
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  mode: 'development'
})
