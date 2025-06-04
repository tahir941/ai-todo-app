// models/task.js 
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estimate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true
    },suggestions: {
    type: DataTypes.JSONB,   // JSONB to store an array of suggestions
    allowNull: true,
  },
  }, {
    tableName: 'tasks',          // matches your table name
    underscored: true,           // for snake_case columns
    createdAt: 'created_at',     // DB column for created_at
    updatedAt: false             // no updated_at in your table
  });

  // Add association method here
  Task.associate = (models) => {
    Task.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
  };

  return Task;
};
