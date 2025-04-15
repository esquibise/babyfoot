// backend/src/routes/tournamentRoutes.js
const express = require('express');
const Tournament = require('../models/Tournament');
const router = express.Router();


router.post('/tournaments', async (req, res) => {
  const { name, date, description } = req.body;

  if (!name || !date) {
    return res.status(400).json({ error: 'Nom et date requis.' });
  }

  try {
    const tournament = await Tournament.create({ name, date, description });
    res.status(201).json(tournament);
  } catch (err) {
    console.error('Erreur lors de la création du tournoi :', err); // ← ici
    res.status(500).json({ error: 'Erreur serveur lors de la création.' });
  }
});

// Route GET pour récupérer tous les tournois

router.get('/tournaments', async (req, res) => {
  try {
    const tournaments = await Tournament.findAll();
    console.log(tournaments);  // Affiche les tournois récupérés
    res.json(tournaments);  // Renvoie la réponse
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des tournois' });
  }
});

// Récupérer un tournoi par ID
router.get('/tournaments/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournoi non trouvé' });
    }
    res.json(tournament);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

//POST teams 

router.post('/tournaments/:id/teams', async (req, res) => {
  const { id } = req.params;
  const { teamName } = req.body;

  if (!teamName) {
    return res.status(400).json({ error: 'Le nom de l\'équipe est requis.' });
  }

  try {
    const tournament = await Tournament.findByPk(id);

    if (!tournament) {
      return res.status(404).json({ error: 'Tournoi non trouvé' });
    }

    const team = await Team.create({ name: teamName, tournamentId: id });

    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'équipe' });
  }
});


module.exports = router;
