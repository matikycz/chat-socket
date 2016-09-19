var path = require('path')
var config = {
  entry: './client/index.js',

  output: {
    path: __dirname,
    filename: '/scripts/bundle.js'
  },

  devServer: {
    inline: true,
    port: 8080
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}

module.exports = config
