require('dotenv').config();
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const faker = require('faker');
const twilioClient = require('twilio');

const AccessToken = twilioClient.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const { TWILIO_ACCOUNT_SID, TWILIO_API_SID, TWILIO_API_SECRET } = process.env;

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

// Endpoint to generate access token
app.get('/token', (req, res) => {
  const identity = faker.name.findName();

  // Create an access token
  const token = new AccessToken(TWILIO_ACCOUNT_SID, TWILIO_API_SID, TWILIO_API_SECRET);
  token.identity = identity;

  // Grant token access to the Video API
  const grant = new VideoGrant();
  token.addGrant(grant);

  response.send({
    identity, token: token.toJwt()
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Express server listening on *:' + port);
});
