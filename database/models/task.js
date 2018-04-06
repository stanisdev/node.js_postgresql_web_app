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

  /**
   * Ralationship
   */
  Task.associate = function(models) {
    models.Task.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      constraints: false
    });
  };

  /**
   * Get tasks by condition
   */
  Task.getAll = function(req) {
    const priority = req.query.priority;
    const done = req.query.done;

    const query = {
      where: {},
      attributes: ['id', 'title', 'priority', 'done', 'user_id'],
      order: [
        ['id', 'ASC']
      ],
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

  /**
   * Find one task by done false
   */
  Task.findByDoneFalse = function(req) {
    return this.findOne({
      where: {
        id: req.params.id,
        done: false,
        user_id: req.user.get('id')
      },
      attributes: ['id', 'done']
    });
  };

  return Task;
};
