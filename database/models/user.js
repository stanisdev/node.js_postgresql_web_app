module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.SMALLINT,
    state: DataTypes.SMALLINT
  }, {});

  User.associate = function(models) {
    // associations can be defined here
  };

  return User;
};
