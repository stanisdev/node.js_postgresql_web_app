const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require(process.env.DB_PATH);

passport.use(new LocalStrategy(
  function(email, password, done) {

    db.User.findOne({
      where: { email },
      attributes: ['id', 'name', 'email', 'role', 'state'],
      raw: true
    }).then((user) => {
      if (!user) {
        return done(null, false, {
          message: 'Incorrect email'
        });
      }
      done(null, user);
    }).catch((err) => {
      done(err);
    });
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

module.exports = passport;
