// backend/src/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('../config/database');
const tournamentRoutes = require('./routes/tournamentRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', tournamentRoutes); // Déclare les routes

// Démarrage du serveur
const startServer = async () => {
  try {
    await sequelize.authenticate();       
    await sequelize.sync();               
    console.log('Connexion à la base de données réussie !');

    app.listen(3001, () => {
      console.log('Serveur backend démarré sur le port 3001');
    });
  } catch (err) {
    console.error('Impossible de se connecter à la base de données :', err);
  }
};


startServer();
