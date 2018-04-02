const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const glob = require('glob');
const nunjucks = require('nunjucks');

const app = express();

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'nunjucks');
const nunjucksConfig = {
  autoescape: true,
  noCache: true,
  express: app
};
nunjucks.configure(__dirname + '/views', nunjucksConfig);

module.exports = app;

/**
 * Get routes
 */
const routes = glob.sync(__dirname + '/routes/*.js');
routes.forEach((route) => {
  require(route);
});

/**
 * Services
 */
const services = glob.sync(__dirname + '/services/*.js');
services.forEach((service) => {
  require(service);
});
