// backend/src/utils/rankingUtils.js

function calculateRanking(teams, completedMatches) {
    if (!teams || teams.length === 0) {
        return [];
    }

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

    // Calculer les points et statistiques
    completedMatches.forEach(match => {
        const team1Ranking = ranking.find(r => r.name === match.team1);
        const team2Ranking = ranking.find(r => r.name === match.team2);

        if (team1Ranking && team2Ranking) {
            team1Ranking.played++;
            team2Ranking.played++;
            team1Ranking.goalsFor += match.scoreTeam1;
            team1Ranking.goalsAgainst += match.scoreTeam2;
            team2Ranking.goalsFor += match.scoreTeam2;
            team2Ranking.goalsAgainst += match.scoreTeam1;
            team1Ranking.goalDifference = team1Ranking.goalsFor - team1Ranking.goalsAgainst;
            team2Ranking.goalDifference = team2Ranking.goalsFor - team2Ranking.goalsAgainst;

            if (match.scoreTeam1 > match.scoreTeam2) {
                team1Ranking.points += 3;
                team1Ranking.wins++;
                team2Ranking.losses++;
            } else if (match.scoreTeam1 < match.scoreTeam2) {
                team2Ranking.points += 3;
                team2Ranking.wins++;
                team1Ranking.losses++;
            } else {
                team1Ranking.points += 1;
                team2Ranking.points += 1;
                team1Ranking.draws++;
                team2Ranking.draws++;
            }
        }
    });

    // Trier le classement
    ranking.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return a.name.localeCompare(b.name);
    });

    return ranking;
}

module.exports = { calculateRanking }; 