module.exports = (sequelize, DataTypes) => {

  var Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 100],
          msg: 'Title value length must be between 1 and 100 symbols'
        },
        notEmpty: {
          msg: 'Title value cannot be empty'
        },
      }
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['low', 'medium', 'high']],
          msg: 'Priority has incorrect value'
        }
      },
      allowNull: false
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      validate: {
        isBool: function(value) {
          if (typeof value != 'boolean') {
            throw new Error('Done value must be a boolean type');
          }
        }
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    }
  }, {
    updatedAt: false
  });

  Task.associate = function(models) {
    // associations can be defined here
  };

  /**
   * Get tasks by condition
   */
  Task.getAll = function(req) {
    const priority = req.query.priority;
    const done = req.query.done;

    const query = {
      where: {},
      attributes: ['id', 'title', 'priority', 'done'],
      raw: true
    };
    if (!req.user.isAdmin()) {
      query.where.user_id = req.user.get('id');
    }
    if (typeof priority == 'string' && ['low', 'medium', 'high'].includes(priority)) {
      query.where.priority = priority;
    }
    if (typeof done == 'string' && ['true', 'false'].includes(done)) {
      query.where.done = JSON.parse(done);
    }
    return this.findAll(query);
  };

  return Task;
};
