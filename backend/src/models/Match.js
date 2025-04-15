const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tournamentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Tournaments', // Nom de la table des tournois
      key: 'id',
    },
  },
  team1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  team2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  scoreTeam1: {
    type: DataTypes.INTEGER,
    allowNull: true, // Le score peut être nul au début
  },
  scoreTeam2: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Ajout d'une référence potentielle aux modèles Team si nécessaire plus tard
});

module.exports = Match; 