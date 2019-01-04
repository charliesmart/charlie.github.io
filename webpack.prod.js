const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    // Cleans out the /docs directory before a build
    new CleanWebpackPlugin('docs', {})
  ]
})
