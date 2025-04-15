// backend/src/routes/tournamentRoutes.js
const express = require('express');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team'); // Assurez-vous que ce modèle existe et est importé
const Match = require('../models/Match');
const { Op } = require('sequelize'); // Pour les opérations complexes si besoin
const { calculateRanking } = require('../utils/rankingUtils'); // Importer la fonction
const router = express.Router();

// --- Routes Tournois ---

/**
 * POST /tournaments
 * Crée un nouveau tournoi.
 * Body: { name: string, date: string, description?: string }
 */
router.post('/tournaments', async (req, res) => {
  const { name, date, description } = req.body;

  if (!name || !date) {
    return res.status(400).json({ error: 'Nom et date requis.' });
  }

  try {
    const tournament = await Tournament.create({ name, date, description });
    res.status(201).json(tournament);
  } catch (err) {
    console.error('Échec de la création du tournoi:', err.message); // Message plus spécifique
    res.status(500).json({ error: 'Impossible de créer le tournoi.' }); // Message utilisateur plus sobre
  }
});

/**
 * GET /tournaments
 * Récupère la liste de tous les tournois.
 */
router.get('/tournaments', async (req, res) => {
  try {
    const tournaments = await Tournament.findAll();
    res.json(tournaments);  // Renvoie la réponse
  } catch (err) {
    console.error('Échec de la récupération des tournois:', err.message);
    res.status(500).json({ error: 'Impossible de récupérer les tournois.' });
  }
});

/**
 * GET /tournaments/:id
 * Récupère un tournoi spécifique par son ID, incluant les équipes et les matchs associés.
 * Params: :id - ID du tournoi
 */
router.get('/tournaments/:id', async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const tournament = await Tournament.findByPk(tournamentId, {
      include: [
        { 
          model: Team, 
          as: 'teams' // Utilise l'alias défini dans Tournament.js
        },
        {
          model: Match,
          as: 'matches' // Utilise l'alias défini dans Tournament.js
        }
      ]
    });

    if (!tournament) {
      return res.status(404).json({ error: 'Tournoi non trouvé' });
    }
    res.json(tournament); // Renvoie le tournoi avec ses équipes et matchs
  } catch (err) {
    console.error(`Échec de la récupération du tournoi ${req.params.id}:`, err.message);
    res.status(500).json({ error: 'Impossible de récupérer le tournoi.' });
  }
});

// --- Routes Équipes (associées à un tournoi) ---

/**
 * POST /tournaments/:id/teams
 * Ajoute une nouvelle équipe à un tournoi spécifique.
 * Params: :id - ID du tournoi
 * Body: { teamName: string }
 */
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
    console.error(`Échec de l'ajout de l'équipe au tournoi ${id}:`, err.message);
    res.status(500).json({ error: 'Impossible d\'ajouter l\'équipe.' }); // Message utilisateur plus sobre
  }
});

// --- Routes Matchs (associés à un tournoi) ---

/**
 * POST /tournaments/:id/generate-matches
 * Génère les matchs pour un tournoi (système round-robin simple).
 * Ne génère les matchs que s'il n'en existe pas déjà pour ce tournoi.
 * Params: :id - ID du tournoi
 */
router.post('/tournaments/:id/generate-matches', async (req, res) => {
  const { id } = req.params;

  try {
    const tournament = await Tournament.findByPk(id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournoi non trouvé' });
    }

    // 1. Récupérer les équipes associées à ce tournoi
    // Note: Ceci suppose que le modèle Team existe et a une relation tournamentId
    const teams = await Team.findAll({ where: { tournamentId: id } });

    if (teams.length < 2) {
      return res.status(400).json({ error: 'Il faut au moins 2 équipes pour générer des matchs.' });
    }

    // 2. Vérifier si des matchs existent déjà pour éviter la duplication
    const existingMatches = await Match.count({ where: { tournamentId: id } });
    if (existingMatches > 0) {
      return res.status(400).json({ error: 'Les matchs ont déjà été générés pour ce tournoi.' });
    }

    // 3. Générer les paires (algorithme simple round-robin)
    const matchesToCreate = [];
    const teamNames = teams.map(t => t.name); // Utiliser les noms pour simplifier

    for (let i = 0; i < teamNames.length; i++) {
      for (let j = i + 1; j < teamNames.length; j++) {
        matchesToCreate.push({
          tournamentId: id,
          team1: teamNames[i],
          team2: teamNames[j],
          // scoreTeam1 et scoreTeam2 sont null par défaut
        });
      }
    }

    // 4. Créer les matchs en base de données
    await Match.bulkCreate(matchesToCreate);

    // 5. Mettre à jour le tournoi pour inclure les matchs générés (optionnel, pour la réponse)
    const updatedTournament = await Tournament.findByPk(id, {
        include: [
            { model: Team, as: 'teams' }, // Assurez-vous que l'alias 'teams' est défini dans le modèle Tournament
            { model: Match, as: 'matches' } // Utilise l'alias défini dans le modèle Tournament
        ]
    });

    res.status(201).json({ message: 'Matchs générés avec succès !', tournament: updatedTournament });

  } catch (err) {
    console.error(`Échec de la génération des matchs pour le tournoi ${id}:`, err.message);
    res.status(500).json({ error: 'Impossible de générer les matchs.' });
  }
});

/**
 * PUT /matches/:matchId
 * Met à jour le score d'un match spécifique.
 * Params: :matchId - ID du match
 * Body: { scoreTeam1: number, scoreTeam2: number }
 */
router.put('/matches/:matchId', async (req, res) => {
  const { matchId } = req.params;
  const { scoreTeam1, scoreTeam2 } = req.body;

  // Validation basique des scores
  if (scoreTeam1 === undefined || scoreTeam1 === null || scoreTeam2 === undefined || scoreTeam2 === null || isNaN(parseInt(scoreTeam1)) || isNaN(parseInt(scoreTeam2))) {
    return res.status(400).json({ error: 'Les scores des deux équipes (scoreTeam1, scoreTeam2) sont requis et doivent être des nombres.' });
  }

  const parsedScore1 = parseInt(scoreTeam1);
  const parsedScore2 = parseInt(scoreTeam2);

  try {
    const match = await Match.findByPk(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match non trouvé' });
    }

    // Mettre à jour les scores
    match.scoreTeam1 = parsedScore1;
    match.scoreTeam2 = parsedScore2;
    await match.save(); // Sauvegarder les changements en BDD

    res.json({ message: 'Score mis à jour avec succès !', match: match });

  } catch (err) {
    console.error(`Échec de la mise à jour du score pour le match ${matchId}:`, err.message);
    res.status(500).json({ error: 'Impossible de mettre à jour le score.' });
  }
});

/**
 * GET /tournaments/:id/ranking
 * Calcule et retourne le classement actuel pour un tournoi spécifique.
 * Se base sur les matchs dont les scores ont été enregistrés.
 * Params: :id - ID du tournoi
 */
router.get('/tournaments/:id/ranking', async (req, res) => {
  const { id } = req.params;

  try {
    const tournament = await Tournament.findByPk(id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournoi non trouvé' });
    }

    const teams = await Team.findAll({ where: { tournamentId: id } });

    const completedMatches = await Match.findAll({
      where: {
        tournamentId: id,
        scoreTeam1: { [Op.not]: null }, 
        scoreTeam2: { [Op.not]: null },
      },
    });

    // Utiliser la fonction utilitaire pour calculer et trier
    const ranking = calculateRanking(teams, completedMatches);

    res.json(ranking); // Renvoie directement le classement calculé

  } catch (err) {
    console.error(`Échec de la récupération du classement pour le tournoi ${id}:`, err.message);
    res.status(500).json({ error: 'Impossible de récupérer le classement.' });
  }
});

module.exports = router;
