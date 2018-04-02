const express = require('express');
const router = express.Router();
const app = require('../app');
const {asyncWrapper} = require('../middlewares/all');

/**
 * Index page
 */
router.get('/', asyncWrapper(async (req, res, next) => {
  res.render('user/index.html', {
    data: 'Index',
  });
}));

app.use('/user', router);
