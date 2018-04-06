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
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Email value not mathes with email-pattern'
        },
        len: {
          args: [6, 50],
          msg: 'Email value length must be between 6 and 50 symbols'
        },
        notEmpty: {
          msg: 'Email value cannot be empty'
        },
        async isUnique(email) {
          try {
            var user = await User.findOne({
              where: { email },
              attributes: ['id']
            });
          } catch (err) {
            throw new Error('Something is going wrong');
          }
          if (user instanceof Object) {
            throw new Error('Email already exists');
          }
          return true;
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password value cannot be empty'
        },
        len: {
          args: [5],
          msg: 'Password value length must be more or equal 5 symbols '
        }
      }
    },
    confirm_password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Confirm password value cannot be empty'
        },
        match: function(value) {
          if (typeof value == 'string' && value.length > 0 && value !== this.password) {
            throw new Error('Password and confirm password are not math');
          }
        }
      },
    },
    role: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'The role value type value must be an integer'
        },
        min: 0,
        max: 32767
      }
    },
    state: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: {
          msg: 'The state value type must be an integer'
        },
        min: 0,
        max: 32767
      }
    }
  }, {
    updatedAt: false
  });

  /**
   * Ralationship
   */
  User.associate = function(models) {
    models.User.hasMany(models.Task, {
      as: 'Tasks',
      foreignKey: 'user_id',
      sourceKey: 'id'
    });
  };

  /**
   * Before create hook
   */
  User.beforeCreate((user) => {
    return new Promise((res, rej) => {
      bcrypt.hash(user.password, 10).then((hash) => {
        user.password = hash;
        res();
      }).catch(rej);
    });
  })

  /**
   * Check password
   */
  User.prototype.isValidPassword = function(password) {
    return bcrypt.compare(password, this.password);
  };

  /**
   * Is current user admin?
   */
  User.prototype.isAdmin = function() {
    return this.role === 1;
  };

  return User;
};
