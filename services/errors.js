const app = require('../app');

/**
 * 404
 */
app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

/**
 * Server error handler
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send('Server error!');
});
