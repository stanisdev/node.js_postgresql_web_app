const express = require('express');
const router = express.Router();
const app = require('../app');
const {asyncWrapper} = require('../middlewares/all');
const passport = require('passport');
const db = require(process.env.DB_PATH);

/**
 * Index page
 */
router.get('/', passport.isAuth, asyncWrapper(async (req, res, next) => {
  const tasks = await db.Task.getAll(req);
  return res.render('tasks/index.html', {
    title: 'Tasks page',
    user: req.user,
    query: req.query,
    tasks
  });
}));

/**
 * Prepare url query for filtering
 */
router.post('/', passport.isAuth, (req, res, next) => {
  const priority = req.body.priority;
  const done = req.body.done;
  let url = '/tasks';

  if (typeof priority == 'string' && ['low', 'medium', 'high'].includes(priority)) {
    url += `?priority=${priority}`;
  }
  if (typeof done == 'string' && ['true', 'false'].includes(done)) {
    url += (url.includes('?') ? '&' : '?') + `done=${done}`;
  }
  res.redirect(url);
});

/**
 * Create new tasks
 */
router.get('/create', passport.isAuth, (req, res, next) => {
  res.render('tasks/create.html', {
    title: 'Create new task'
  });
});

/**
 * Create new tasks (POST)
 */
router.post('/create', passport.isAuth, asyncWrapper(async (req, res, next) => {
  req.body.done = false;
  req.body.user_id = req.user.get('id');

  try {
    var task = db.Task.build(req.body);
    await task.validate();
  } catch (errors) {
    res.render('tasks/create.html', {
      title: 'Create new task',
      errors
    });
  }
  try {
    await task.save();
  } catch (err) {
    return next(err);
  }
  return res.redirect('/tasks');
}));

/**
 * Mark task as done
 */
router.get('/:id/done', passport.isAuth, asyncWrapper(async (req, res, next) => {
  const task = await db.Task.findByDoneFalse(req);
  if (!(task instanceof Object)) {
    return res.send('Task not found');
  }
  task.set('done', true)
  await task.save();
  return res.redirect('/tasks');
}));

app.use('/tasks', router);
