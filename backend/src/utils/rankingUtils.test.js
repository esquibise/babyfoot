const { calculateRanking } = require('./rankingUtils');

describe('Ranking Calculation', () => {
  const teams = [
    { name: 'Team A' },
    { name: 'Team B' },
    { name: 'Team C' },
  ];

  test('should return empty array for no teams', () => {
    expect(calculateRanking([], [])).toEqual([]);
  });

  test('should calculate points correctly for wins, losses, draws', () => {
    const matches = [
      { team1: 'Team A', team2: 'Team B', scoreTeam1: 3, scoreTeam2: 1 }, // A wins (3 pts), B loses (0 pts)
      { team1: 'Team A', team2: 'Team C', scoreTeam1: 2, scoreTeam2: 2 }, // A draws (1 pt), C draws (1 pt)
      { team1: 'Team B', team2: 'Team C', scoreTeam1: 0, scoreTeam2: 1 }, // C wins (3 pts), B loses (0 pts)
    ];
    const ranking = calculateRanking(teams, matches);
    
    // Points: A=4, C=4, B=0
    expect(ranking[0].name).toBe('Team A'); // Team A should be first (better goal diff)
    expect(ranking[0].points).toBe(4);
    expect(ranking[1].name).toBe('Team C');
    expect(ranking[1].points).toBe(4);
    expect(ranking[2].name).toBe('Team B');
    expect(ranking[2].points).toBe(0);
  });

  test('should calculate all stats correctly', () => {
     const matches = [
      { team1: 'Team A', team2: 'Team B', scoreTeam1: 3, scoreTeam2: 1 }, 
      { team1: 'Team A', team2: 'Team C', scoreTeam1: 2, scoreTeam2: 2 }, 
      { team1: 'Team B', team2: 'Team C', scoreTeam1: 0, scoreTeam2: 1 }, 
    ];
    const ranking = calculateRanking(teams, matches);
    const teamA = ranking.find(t => t.name === 'Team A');
    const teamB = ranking.find(t => t.name === 'Team B');
    const teamC = ranking.find(t => t.name === 'Team C');

    expect(teamA).toEqual({ name: 'Team A', points: 4, played: 2, wins: 1, draws: 1, losses: 0, goalsFor: 5, goalsAgainst: 3, goalDifference: 2 });
    expect(teamB).toEqual({ name: 'Team B', points: 0, played: 2, wins: 0, draws: 0, losses: 2, goalsFor: 1, goalsAgainst: 4, goalDifference: -3 });
    expect(teamC).toEqual({ name: 'Team C', points: 4, played: 2, wins: 1, draws: 1, losses: 0, goalsFor: 3, goalsAgainst: 2, goalDifference: 1 });
  });

   test('should sort teams correctly based on criteria', () => {
    const teamsExtended = [...teams, { name: 'Team D' }];
    const matches = [
      { team1: 'Team A', team2: 'Team B', scoreTeam1: 1, scoreTeam2: 0 }, // A: 3, B: 0
      { team1: 'Team C', team2: 'Team D', scoreTeam1: 1, scoreTeam2: 0 }, // C: 3, D: 0
      { team1: 'Team A', team2: 'Team C', scoreTeam1: 2, scoreTeam2: 2 }, // A: 4, C: 4 (A gd=1, C gd=1)
      { team1: 'Team B', team2: 'Team D', scoreTeam1: 5, scoreTeam2: 0 }, // B: 3, D: 0 (B gd=+4, D gd=-6)
      // Final points: A=4, C=4, B=3, D=0
      // Final GD: A=1, C=1, B=+4, D=-6
    ];
    const ranking = calculateRanking(teamsExtended, matches);

    // Expected order: A, C (same pts, same gd, A comes first alpha), B, D
    expect(ranking.map(t => t.name)).toEqual(['Team A', 'Team C', 'Team B', 'Team D']);
  });

}); 