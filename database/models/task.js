module.exports = (sequelize, DataTypes) => {

  var Task = sequelize.define('Task', {
    title: DataTypes.STRING,
    priority: DataTypes.INTEGER,
    done: DataTypes.BOOLEAN
  }, {
    updatedAt: false
  });

  Task.associate = function(models) {
    // associations can be defined here
  };

  return Task;
};
