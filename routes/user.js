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
router.post('/registration', asyncWrapper(async (req, res, next) => {
  req.body.role = 0;
  req.body.state = 1;
  req.body.createdAt = new Date();
  const user = db.User.build(req.body);
  try {
    await user.validate();
  } catch (errors) {
    return res.render('user/registration.html', {
      title: 'Create new user',
      errors,
      user
    });
  }
  try {
    await user.save();
  } catch (err) {
    return next(err);
  }
  return res.redirect('/user/login');
}));

app.use('/user', router);
