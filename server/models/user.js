module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users',        // Matches your actual table name
    underscored: true,         // Maps camelCase to snake_case
    createdAt: 'created_at',   // Explicitly define DB column name
    updatedAt: false           // No updated_at column in your DB
  });

  return User;
};
