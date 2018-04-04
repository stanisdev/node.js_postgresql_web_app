const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require(process.env.DB_PATH);

passport.use(new LocalStrategy(
  function(email, password, done) {

    db.User.findOne({
      where: { email },
      attributes: ['id', 'name', 'password', 'email', 'role', 'state'],
    }).then((user) => {
      if (!(user instanceof Object)) {
        return done(null, false, {
          message: 'Incorrect email'
        });
      }
      if (!Number.isInteger(user.state) || user.state < 1) {
        return done(null, false, {
          message : 'User not activated'
        });
      }
      user.isValidPassword(password).then((validate) => {
        if (!validate) {
          return done(null, false, {
            message : 'Wrong Password'
          });
        }
        done(null, user);
      }).catch(done);
    }).catch(done);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.User.findOne({
    where: { id },
    attributes: ['id', 'name', 'email', 'role', 'state'],
    raw: true
  }).then((user) => {
    done(null, user);
  }).catch((err) => {
    done(err, null);
  });
});

passport.isAuth = function(req, res, next) {
  if (!req.isAuthenticated() || !(req.user instanceof Object) || !Number.isInteger(req.user.state) && req.user.state < 1) {
    return res.redirect('/user/login');
  }
  next();
};

module.exports = passport;
