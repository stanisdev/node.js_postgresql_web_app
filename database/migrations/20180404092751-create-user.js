module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      role: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0 // 0: user, 1: admin
      },
      state: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 1 // -1: blocked, 0: not active, 1: active
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
