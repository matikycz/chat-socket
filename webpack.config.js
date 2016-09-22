var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var config = {
  entry: './client/main.jsx',

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
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
	// loader dla plików z rozszerzeniem .jsx - babel z presetami es2015/react
	test: /.json$/,
	loader: 'json-loader'
      },
      {
	// loader dla plików scss
	test: /\.scss$/,
	loader: ExtractTextPlugin.extract(
	'style',
	'css!sass')
      },
      {
	// loader dla plików statycznych
	test: /\.(ttf|woff|woff2|eot|jpg|png)$/,
	loader: 'url-loader?limit=30000&name=content/[name]-[hash].[ext]'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('./styles/bundle.css'),
    new webpack.DefinePlugin({
     'process.env': {
       NODE_ENV: JSON.stringify('developement')
     }
   })
  ],
  sassLoader: {
    includePaths: [path.resolve(__dirname, './sass')]
  },
  resolve: {
    root: path.resolve(__dirname),
    // importy w postaci 'app/plik' powinny być wyszukiwać pliki app/plik.js oraz app/plik.jsx
    extensions: ['', '.js', '.jsx']
  }
}

module.exports = config
