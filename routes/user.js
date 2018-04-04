const express = require('express');
const router = express.Router();
const app = require('../app');
const {asyncWrapper} = require('../middlewares/all');
const passport = require('passport');
const db = require(process.env.DB_PATH);

/**
 * Index page
 */
router.get('/login', asyncWrapper(async (req, res, next) => {
  res.render('user/login.html', {
    title: 'Login to board'
  });
}));

/**
 * User's attempt to login
 */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true,
  successFlash: 'Welcome!'
}));

/**
 * Logout from system
 */
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/user/login');
});

/**
 * Create new account (GET)
 */
router.get('/registration', (req, res, next) => {
  res.render('user/registration.html', {
    title: 'Create new user'
  });
});

/**
 * Create new account (POST)
 */
router.post('/registration', (req, res, next) => {
  res.json({});
});

app.use('/user', router);
