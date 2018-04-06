const express = require('express');
const router = express.Router();
const app = require('../app');
const passport = require('passport');

/**
 * Main url
 */
router.get('/', passport.isAuth, (req, res, next) => {
  res.redirect('tasks');
});

app.use('/', router);
