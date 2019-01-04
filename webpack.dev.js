const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',

  /**
   * Start a server on port 8000. If you want to see additional logging,
   * you can delete the stats: 'minimal' line
   */
  devServer: {
      contentBase: path.join(__dirname, 'docs'),
      port: 8000,
      stats: 'minimal',
      historyApiFallback: true
  }
})
