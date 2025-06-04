const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite::memory:');

// Import models
const Task = require('./task')(sequelize, DataTypes);
const User = require('./user')(sequelize, DataTypes);
const Category = require('./Category')(sequelize, DataTypes);

// Setup associations using associate methods
if (Task.associate) Task.associate({ Category });

Category.hasMany(Task, {
  foreignKey: 'category_id',
});

const db = {
  sequelize,
  Sequelize,
  Task,
  User,
  Category,
};

module.exports = db;
