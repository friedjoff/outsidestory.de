const ExtractTextPlugin = require("extract-text-webpack-plugin")
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'static')
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: 'css-loader'
      })
    }, 
    {
      test: /\.(gif|png|svg)$/,
      use: [ 'url-loader' ]
    }]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
  ]
}