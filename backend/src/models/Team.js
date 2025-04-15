const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Team = sequelize.define('Team', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tournamentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Tournaments',
      key: 'id',
    },
  },
});

module.exports = Team;
