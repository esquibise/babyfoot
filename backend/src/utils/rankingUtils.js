// backend/src/utils/rankingUtils.js

function calculateRanking(teams, completedMatches) {
    if (!teams || teams.length === 0) {
        return [];
    }

    // Initialiser le tableau de classement pour chaque équipe avec des statistiques à zéro.
    const initialRanking = teams.map(team => ({
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

    // Parcourir chaque match terminé pour mettre à jour les statistiques des équipes concernées.
    completedMatches.forEach(match => {
        // Trouver les entrées correspondantes dans le classement pour les deux équipes du match.
        const team1Stats = initialRanking.find(rankEntry => rankEntry.name === match.team1);
        const team2Stats = initialRanking.find(rankEntry => rankEntry.name === match.team2);

        // S'assurer que les deux équipes existent dans notre classement avant de continuer.
        if (team1Stats && team2Stats) {
            team1Stats.played++;
            team2Stats.played++;
            team1Stats.goalsFor += match.scoreTeam1;
            team1Stats.goalsAgainst += match.scoreTeam2;
            team2Stats.goalsFor += match.scoreTeam2;
            team2Stats.goalsAgainst += match.scoreTeam1;
            team1Stats.goalDifference = team1Stats.goalsFor - team1Stats.goalsAgainst;
            team2Stats.goalDifference = team2Stats.goalsFor - team2Stats.goalsAgainst;

            // Attribuer les points en fonction du résultat du match (3 pour victoire, 1 pour nul, 0 pour défaite).
            if (match.scoreTeam1 > match.scoreTeam2) { // Victoire équipe 1
                team1Stats.points += 3;
                team1Stats.wins++;
                team2Stats.losses++;
            } else if (match.scoreTeam1 < match.scoreTeam2) { // Victoire équipe 2
                team2Stats.points += 3;
                team2Stats.wins++;
                team1Stats.losses++;
            } else { // Match nul
                team1Stats.points += 1;
                team2Stats.points += 1;
                team1Stats.draws++;
                team2Stats.draws++;
            }
        }
    });

    // Trier le classement final selon les critères usuels :
    // 1. Points (décroissant)
    // 2. Différence de buts (décroissant)
    // 3. Buts marqués (décroissant)
    // 4. Nom de l'équipe (alphabétique, pour départager les égalités parfaites)
    initialRanking.sort((teamA, teamB) => {
        if (teamB.points !== teamA.points) return teamB.points - teamA.points;
        if (teamB.goalDifference !== teamA.goalDifference) return teamB.goalDifference - teamA.goalDifference;
        if (teamB.goalsFor !== teamA.goalsFor) return teamB.goalsFor - teamA.goalsFor;
        // En cas d'égalité sur les critères précédents, tri alphabétique par nom.
        return teamA.name.localeCompare(teamB.name);
    });

    return initialRanking;
}

module.exports = { calculateRanking }; 