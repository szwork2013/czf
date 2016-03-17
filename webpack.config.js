var path = require('path');
var webpack = require('webpack');
var config = require('./config');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:6100',
    'webpack/hot/only-dev-server',
    './client/main.jsx'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/'),
    publicPath: "/public/"
  },
  module: {
    preLoaders: [{
      test: [/\.js$/, /\.jsx$/],
      loader: "eslint-loader",
      exclude: /node_modules/
    }],
    loaders: [{
      test: /\.css$/,
      exclude: /node_modules/,
      loader: "style-loader!css-loader"
    }, {
      test: [/\.js$/, /\.jsx$/],
      exclude: /node_modules/,
      loaders: [
        'babel'
      ],
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      loaders: ['style', 'css', 'sass'],
    }, ],
  },
  eslint: {
    configFile: path.resolve(__dirname, '.eslintrc'),
    formatter: require("eslint-friendly-formatter"),
    failOnError: true
  },
  // because I had add --hot flag
  // plugins: [
  //   new webpack.HotModuleReplacementPlugin()
  // ],
  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://localhost:'+config.port,
        secure: false,
      }
    }
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};