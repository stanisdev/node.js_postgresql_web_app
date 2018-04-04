const express = require('express');
const router = express.Router();
const app = require('../app');
const {asyncWrapper} = require('../middlewares/all');
const passport = require('passport');

/**
 * Index page
 */
router.get('/login', asyncWrapper(async (req, res, next) => {
  res.render('user/login.html', {});
}));

/**
 * Index page
 */
router.get('/back', asyncWrapper(async (req, res, next) => {
  res.send('One');
}));

/**
 * User's attempt to login
 */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: 'Invalid username or password.',
  successFlash: 'Welcome!'
}));

app.use('/user', router);
