// backend/src/models/Tournament.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Match = require('./Match'); // Importer le modèle Match
const Team = require('./Team'); // Importer le modèle Team

const Tournament = sequelize.define('Tournament', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Définir l'association : un tournoi a plusieurs matchs
Tournament.hasMany(Match, { foreignKey: 'tournamentId', as: 'matches' });
Match.belongsTo(Tournament, { foreignKey: 'tournamentId' });

// Définir l'association : un tournoi a plusieurs équipes
Tournament.hasMany(Team, { foreignKey: 'tournamentId', as: 'teams' });
Team.belongsTo(Tournament, { foreignKey: 'tournamentId' });

module.exports = Tournament;
