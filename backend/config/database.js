// backend/config/database.js
const { Sequelize } = require('sequelize');

// Configuration de la base de données SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Le fichier SQLite
});

module.exports = sequelize;
