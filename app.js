const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const glob = require('glob');
const nunjucks = require('nunjucks');
const flash = require('express-flash');

const app = express();
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

app.use(session({
  store: new RedisStore({
    host: '127.0.0.1',
    port: 6379
  }),
  secret: 'Some secret key',
  resave: false
}));
app.use(flash());
process.env.DB_PATH = __dirname + '/database/models';
const passport = require('./services/passport');

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

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
