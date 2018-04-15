require('dotenv').config();
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const faker = require('faker');

const app = express();
if (process.env.NODE_ENV === 'DEV') { // Configuration for development environment
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('./webpack.config.js');
  const webpackCompiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(webpackCompiler, {
    hot: true
  }));
  app.use(webpackHotMiddleware(webpackCompiler));
  app.use(express.static(path.join(__dirname, 'app')));
} else if (process.env.NODE_ENV === 'PROD') { // Configuration for production environment
  app.use(express.static(path.join(__dirname, 'dist')));
}

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Express server listening on *:' + port);
});
