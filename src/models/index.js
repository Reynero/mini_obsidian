const { sequelize } = require('../config/database');
const User = require('./users.js');
const Note = require('./notes.js');

// Define relationships
// One-to-Many: One User can have many Notes
User.hasMany(Note, {
  foreignKey: 'user_id',
  as: 'notes',
  onDelete: 'CASCADE'
});

Note.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Sync models with database (creates tables if they don't exist)
const syncDatabase = async () => {
  try {
    // Use force: true only in development to drop and recreate tables
    // In production, use migrations instead
    await sequelize.sync({ 
      alter: process.env.NODE_ENV === 'development' 
    });
    console.log('Database models synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Note,
  syncDatabase
};