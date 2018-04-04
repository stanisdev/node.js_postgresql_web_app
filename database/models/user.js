const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'Name value length must be between 2 and 50 symbols'
        },
        notEmpty: {
          msg: 'Name value cannot be empty'
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Email value is incorrect'
        },
        len: {
          args: [6, 50],
          msg: 'Email value length must be between 6 and 50 symbols'
        },
        notEmpty: {
          msg: 'Email value cannot be empty'
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: 60,
          msg: 'Password value length must be equal 60 symbols'
        },
        notEmpty: {
          msg: 'Password value cannot be empty'
        }
      }
    },
    role: {
      type: DataTypes.SMALLINT
    },
    state: {
      type: DataTypes.SMALLINT
    }
  }, {
    updatedAt: false
  });

  User.associate = function(models) {
    // associations can be defined here
  };

  User.beforeCreate((user) => {
    return new Promise((res, rej) => {
      bcrypt.hash(user.password, 10).then((hash) => {
        user.password = hash;
        res();
      }).catch(rej);
    });
  })

  User.prototype.isValidPassword = function(password) {
    return new Promise((res, rej) => {
      bcrypt.compare(password, this.password).then(res).catch(rej);
    });
  };

  User.prototype.isAdmin = function() {
    return this.role === 1;
  };

  return User;
};
