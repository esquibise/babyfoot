// backend/src/routes/tournamentRoutes.js
const express = require('express');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team'); // Assurez-vous que ce modèle existe et est importé
const Match = require('../models/Match');
const { Op } = require('sequelize'); // Pour les opérations complexes si besoin
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

// Récupérer un tournoi par ID (MODIFIÉE pour inclure équipes et matchs)
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
    console.error('Erreur serveur lors de la récupération du tournoi:', err);
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

// Nouvelle route pour générer les matchs d'un tournoi
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
    console.error('Erreur lors de la génération des matchs:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la génération des matchs.' });
  }
});

// Nouvelle route pour mettre à jour le score d'un match
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
    console.error('Erreur lors de la mise à jour du score:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du score.' });
  }
});

// Nouvelle route pour récupérer le classement d'un tournoi
router.get('/tournaments/:id/ranking', async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier si le tournoi existe
    const tournament = await Tournament.findByPk(id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournoi non trouvé' });
    }

    // Récupérer toutes les équipes du tournoi
    const teams = await Team.findAll({ where: { tournamentId: id } });
    if (!teams || teams.length === 0) {
      return res.json([]); // Retourner un classement vide s'il n'y a pas d'équipes
    }

    // Récupérer tous les matchs terminés (avec scores) du tournoi
    const completedMatches = await Match.findAll({
      where: {
        tournamentId: id,
        scoreTeam1: { [Op.not]: null }, // Score non nul
        scoreTeam2: { [Op.not]: null }, // Score non nul
      },
    });

    // Initialiser le tableau de classement
    const ranking = teams.map(team => ({
      name: team.name,
      points: 0,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0
    }));

    // Calculer les points et statistiques pour chaque match terminé
    completedMatches.forEach(match => {
      const team1Ranking = ranking.find(r => r.name === match.team1);
      const team2Ranking = ranking.find(r => r.name === match.team2);

      if (team1Ranking && team2Ranking) {
        // Mettre à jour matchs joués et buts
        team1Ranking.played++;
        team2Ranking.played++;
        team1Ranking.goalsFor += match.scoreTeam1;
        team1Ranking.goalsAgainst += match.scoreTeam2;
        team2Ranking.goalsFor += match.scoreTeam2;
        team2Ranking.goalsAgainst += match.scoreTeam1;
        team1Ranking.goalDifference = team1Ranking.goalsFor - team1Ranking.goalsAgainst;
        team2Ranking.goalDifference = team2Ranking.goalsFor - team2Ranking.goalsAgainst;

        // Attribuer les points
        if (match.scoreTeam1 > match.scoreTeam2) { // Victoire équipe 1
          team1Ranking.points += 3;
          team1Ranking.wins++;
          team2Ranking.losses++;
        } else if (match.scoreTeam1 < match.scoreTeam2) { // Victoire équipe 2
          team2Ranking.points += 3;
          team2Ranking.wins++;
          team1Ranking.losses++;
        } else { // Match nul
          team1Ranking.points += 1;
          team2Ranking.points += 1;
          team1Ranking.draws++;
          team2Ranking.draws++;
        }
      }
    });

    // Trier le classement
    ranking.sort((a, b) => {
      // 1. Par points (décroissant)
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      // 2. Par différence de buts (décroissant)
      if (b.goalDifference !== a.goalDifference) {
          return b.goalDifference - a.goalDifference;
      }
      // 3. Par buts marqués (décroissant)
      if (b.goalsFor !== a.goalsFor) {
          return b.goalsFor - a.goalsFor;
      }
      // 4. Par nom (alphabétique)
      return a.name.localeCompare(b.name);
    });

    res.json(ranking);

  } catch (err) {
    console.error('Erreur lors de la récupération du classement:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du classement.' });
  }
});

module.exports = router;
