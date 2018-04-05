const express = require('express');
const router = express.Router();
const app = require('../app');
const {asyncWrapper} = require('../middlewares/all');
const passport = require('passport');

/**
 * Index page
 */
router.get('/', passport.isAuth, asyncWrapper(async (req, res, next) => {
  res.render('tasks/index.html', {
    title: 'Main page',
    user: req.user
  });
}));

app.use('/', router);
