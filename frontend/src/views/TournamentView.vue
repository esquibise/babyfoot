<template>
    <div v-if="tournament" class="view-container tournament-details-container">
      <h1 class="view-title tournament-title">{{ tournament.name }}</h1>
      <p class="tournament-date"><strong>Date :</strong> {{ formatDate(tournament.date) }}</p>
      <p class="tournament-description"><strong>Description :</strong> {{ tournament.description || 'Non fournie' }}</p>
  
      <div class="grid-container">
        <!-- Colonne de Gauche: Équipes et Matchs -->
        <div class="column column-left">
          <!-- Section Équipes -->
          <div class="details-section">
             <div class="section-header">
                <h2 class="section-title">Équipes</h2>
                <router-link 
                  :to="{ name: 'CreateTeam', params: { id: tournamentId } }" 
                  class="btn btn-secondary add-team-btn"
                >
                  Ajouter une Équipe
                </router-link>
             </div>
            <ul v-if="tournament.teams && tournament.teams.length" class="item-list team-list">
              <li v-for="(team, index) in tournament.teams" :key="team.id || index">{{ team.name || team }}</li>
            </ul>
            <p v-else class="no-items-message">Aucune équipe inscrite.</p>
          </div>
          
          <!-- Section Matchs -->
          <div class="details-section">
            <div class="section-header">
              <h2 class="section-title">Matchs</h2>
              <button 
                v-if="tournament.teams && tournament.teams.length >= 2 && (!tournament.matches || tournament.matches.length === 0) && !isLoadingMatches"
                @click="generateMatches"
                class="btn btn-secondary generate-btn"
              >
                Générer les Matchs
              </button>
              <span v-if="isLoadingMatches" class="loading-spinner">🌀</span>
            </div>
            
            <p v-if="generateError" class="error-message">{{ generateError }}</p>
            <p v-if="generateSuccess" class="success-message">{{ generateSuccess }}</p>
    
            <div v-if="tournament.matches && tournament.matches.length" class="match-list-container">
              <ul class="item-list match-list">
                <li v-for="(match) in tournament.matches" :key="match.id" class="match-item">
                   <div class="match-info">
                      <span class="team-name">{{ match.team1 }}</span> 
                      <span class="vs">vs</span> 
                      <span class="team-name">{{ match.team2 }}</span>
                   </div>
                  <div class="score-section">
                     <div v-if="match.scoreTeam1 !== null && match.scoreTeam2 !== null && !editStates[match.id]" class="score-display">
                        <span class="match-score">{{ match.scoreTeam1 }} - {{ match.scoreTeam2 }}</span>
                        <button @click="toggleEditScore(match.id)" class="btn-edit-score">✏️</button>
                     </div>
                     <form v-else @submit.prevent="updateScore(match)" class="score-form">
                        <input type="number" v-model.number="scoresInput[match.id].score1" min="0" required class="score-input" placeholder="S1" />
                        <span class="separator">-</span>
                        <input type="number" v-model.number="scoresInput[match.id].score2" min="0" required class="score-input" placeholder="S2"/>
                        <button type="submit" :disabled="loadingStates[match.id]" class="btn btn-save-score">{{ loadingStates[match.id] ? '...' : '💾' }}</button>
                        <button v-if="match.scoreTeam1 !== null" @click="cancelEdit(match.id)" type="button" class="btn-cancel-edit">❌</button> 
                     </form>
                     <p v-if="errorStates[match.id]" class="error-message-inline">{{ errorStates[match.id] }}</p>
                  </div>
                </li>
              </ul>
            </div>
            <p v-else-if="!isLoadingMatches" class="no-items-message">Aucun match généré.</p>
          </div>
        </div>

        <!-- Colonne de Droite: Classement -->
        <div class="column column-right">
           <div class="details-section ranking-section">
             <h2 class="ranking-title">Classement</h2>
             <div v-if="isLoadingRanking" class="loading-message-inline">Chargement du classement...</div>
             <div v-else-if="rankingError" class="error-message-inline">{{ rankingError }}</div>
             <table v-else-if="rankingData && rankingData.length" class="ranking-table">
               <thead>
                 <tr><th>#</th><th>Équipe</th><th>Pts</th><th>J</th><th>G</th><th>N</th><th>P</th><th>+/-</th></tr>
               </thead>
               <tbody>
                 <tr v-for="(team, index) in rankingData" :key="team.name">
                   <td>{{ index + 1 }}</td><td>{{ team.name }}</td><td>{{ team.points }}</td><td>{{ team.played }}</td><td>{{ team.wins }}</td><td>{{ team.draws }}</td><td>{{ team.losses }}</td><td>{{ team.goalDifference }}</td>
                 </tr>
               </tbody>
             </table>
             <p v-else class="no-items-message">Aucun classement disponible.</p>
           </div>
        </div>
      </div> <!-- Fin grid-container -->

    </div>
    <div v-else class="loading-message">
      <p>Chargement du tournoi...</p>
    </div>
</template>
  
<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const tournament = ref(null);
const isLoadingTournament = ref(true);
const isLoadingMatches = ref(false);
const generateError = ref('');
const generateSuccess = ref('');

// États pour la saisie/modification des scores
const scoresInput = reactive({}); // Stocke les valeurs des inputs { matchId: { score1: 0, score2: 0 } }
const editStates = reactive({});   // Stocke si un match est en mode édition { matchId: true/false }
const loadingStates = reactive({}) // Stocke l'état de chargement par match { matchId: true/false }
const errorStates = reactive({});   // Stocke les erreurs par match { matchId: "message" }

// États pour le classement (ajoutés)
const rankingData = ref([]);
const isLoadingRanking = ref(false);
const rankingError = ref('');

const tournamentId = computed(() => route.params.id);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR');
};

const initializeScoreInputs = (matches) => {
  matches.forEach(match => {
    if (!scoresInput[match.id]) { // Initialiser seulement si ça n'existe pas
       scoresInput[match.id] = { 
          score1: match.scoreTeam1 !== null ? match.scoreTeam1 : '', // Utiliser '' pour le placeholder
          score2: match.scoreTeam2 !== null ? match.scoreTeam2 : ''
       }; 
    }
    if (editStates[match.id] === undefined) {
        editStates[match.id] = match.scoreTeam1 === null; // Mode édition par défaut si pas de score
    }
    loadingStates[match.id] = false;
    errorStates[match.id] = '';
  });
};

const fetchTournamentData = async () => {
  isLoadingTournament.value = true;
  generateError.value = '';
  generateSuccess.value = '';
  try {
    const res = await fetch(`/api/tournaments/${tournamentId.value}`);
    if (!res.ok) throw new Error('Erreur API lors de la récupération');
    const data = await res.json();
    data.teams = data.teams || [];
    data.matches = data.matches || [];
    tournament.value = data;
    initializeScoreInputs(tournament.value.matches);
    console.log('[TournamentView] fetchTournamentData successful, calling fetchRanking...');
    await fetchRanking();
  } catch (err) {
    console.error('Erreur de récupération du tournoi :', err);
  } finally {
      isLoadingTournament.value = false;
  }
};

const generateMatches = async () => {
    isLoadingMatches.value = true;
    generateError.value = '';
    generateSuccess.value = '';
    try {
        const res = await fetch(`/api/tournaments/${tournamentId.value}/generate-matches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Erreur lors de la génération des matchs.');
        }

        if (data.tournament && data.tournament.matches) {
           tournament.value.matches = data.tournament.matches; 
           initializeScoreInputs(tournament.value.matches); // Réinitialiser les inputs/états
        } else {
           await fetchTournamentData(); 
        }
        generateSuccess.value = data.message || 'Matchs générés avec succès !';
        console.log('[TournamentView] generateMatches successful, calling fetchRanking...');
        await fetchRanking();
    } catch (err) {
        console.error("Erreur generateMatches:", err);
        generateError.value = err.message || 'Impossible de générer les matchs.';
    } finally {
        isLoadingMatches.value = false;
    }
};

const toggleEditScore = (matchId) => {
  editStates[matchId] = true;
  // Réinitialiser l'input aux scores actuels si on re-édite
  const match = tournament.value.matches.find(m => m.id === matchId);
  if (match) {
       scoresInput[matchId] = { 
          score1: match.scoreTeam1 !== null ? match.scoreTeam1 : '', 
          score2: match.scoreTeam2 !== null ? match.scoreTeam2 : ''
       }; 
  }
  errorStates[matchId] = ''; // Clear error on edit
};

const cancelEdit = (matchId) => {
    editStates[matchId] = false;
    errorStates[matchId] = ''; // Clear error on cancel
     // Pas besoin de reset l'input ici car on ne sauvegarde pas
};

const updateScore = async (match) => {
  const matchId = match.id;
  loadingStates[matchId] = true;
  errorStates[matchId] = '';
  const scoreData = scoresInput[matchId];

  // Vérification simple que les scores sont des nombres
  if (scoreData.score1 === '' || scoreData.score2 === '' || isNaN(Number(scoreData.score1)) || isNaN(Number(scoreData.score2))) {
      errorStates[matchId] = 'Scores invalides.';
      loadingStates[matchId] = false;
      return;
  }

  try {
    const res = await fetch(`/api/matches/${matchId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          scoreTeam1: Number(scoreData.score1), 
          scoreTeam2: Number(scoreData.score2) 
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors de la sauvegarde du score.');
    }

    // Mettre à jour le match dans le state local
    match.scoreTeam1 = data.match.scoreTeam1;
    match.scoreTeam2 = data.match.scoreTeam2;
    editStates[matchId] = false; // Sortir du mode édition
    console.log('[TournamentView] updateScore successful, calling fetchRanking...');
    await fetchRanking();

  } catch (err) {
    console.error("Erreur updateScore:", err);
    errorStates[matchId] = err.message || 'Erreur sauvegarde.';
  } finally {
    loadingStates[matchId] = false;
  }
};

const fetchRanking = async () => {
    if (!tournamentId.value) return;
    console.log('[Ranking] Attempting to fetch ranking...'); 
    isLoadingRanking.value = true;
    rankingError.value = '';
    try {
        console.log(`[Ranking] Fetching from: /api/tournaments/${tournamentId.value}/ranking`);
        const res = await fetch(`/api/tournaments/${tournamentId.value}/ranking`);
        console.log('[Ranking] Fetch response status:', res.status);
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Erreur lors de la récupération du classement.');
        }
        rankingData.value = await res.json(); // Le backend renvoie directement le tableau
    } catch (err) {
        console.error("[Ranking] Error in fetchRanking:", err);
        rankingError.value = err.message;
        rankingData.value = []; // Vider en cas d'erreur
    } finally {
        isLoadingRanking.value = false;
    }
};

onMounted(() => {
    console.log('[TournamentView] Component mounted, calling fetchTournamentData...');
    fetchTournamentData();
});
</script>

<style scoped>
.tournament-title {
    /* Hérite de .view-title, pas besoin de plus pour l'instant */
}

.tournament-date,
.tournament-description {
  color: #555;
  margin-bottom: 8px;
  text-align: center;
}

.tournament-description {
  margin-bottom: 30px;
}

.details-section {
  margin-bottom: 35px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  color: #333;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-list li {
  padding: 15px 20px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-left: 4px solid #bdbdbd;
  border-radius: 6px;
  transition: all 0.2s ease;
  box-shadow: none;
}

.item-list li:hover {
  border-left-color: #42a5f5;
  background-color: #fff;
  transform: translateX(5px);
  box-shadow: 0 3px 6px rgba(0,0,0,0.05);
}

.item-list li::before { content: none; }

.team-list li {
   border-left-color: #7e57c2;
}
.team-list li:hover {
   border-left-color: #5e35b1;
}

.match-item {
    border-left-color: #ffa726;
}
.match-item:hover {
   border-left-color: #fb8c00;
}

.match-score {
  font-weight: 700;
  color: #1b5e20;
  background-color: #dcedc8;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 10px;
}

.no-items-message {
  color: #757575;
  font-style: italic;
  padding: 10px;
  background-color: #fafafa;
  border-radius: 4px;
}

.loading-message {
  text-align: center;
  padding: 40px;
  color: #757575;
  font-size: 1.2rem;
}

.generate-btn {
  padding: 8px 15px;
  font-size: 0.9rem;
  background-color: #78909c;
  color: white;
}

.generate-btn:hover {
  background-color: #546e7a;
}

.loading-spinner {
  font-size: 1.5rem;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.success-message {
  margin-top: 10px;
  margin-bottom: 15px;
  color: #2e7d32;
  background-color: #e8f5e9;
  padding: 10px;
  border-radius: 4px;
  border-left: 4px solid #2e7d32;
}

.error-message {
  margin-top: 10px;
  margin-bottom: 15px;
  color: #c62828;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  border-left: 4px solid #c62828;
}

.item-list.match-list li {
  /* Styles existants pour les li */
}

.match-info {
  flex-grow: 1;
}

.team-name {
  font-weight: 500;
}

.vs {
  margin: 0 10px;
  color: #757575;
  font-style: italic;
}

.score-section {
  display: flex;
  align-items: center;
  margin-left: 20px;
  min-width: 220px;
  position: relative;
}

.score-display {
    display: flex;
    align-items: center;
}

.match-score {
  margin: 0;
  padding: 4px 8px;
}

.btn-edit-score {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    margin-left: 10px;
    padding: 5px;
    line-height: 1;
    color: #666;
}
.btn-edit-score:hover {
    color: #000;
}

.score-form {
  display: flex;
  align-items: center;
  gap: 5px;
}

.score-input {
  width: 55px;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
}
.score-input:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.score-input::-webkit-outer-spin-button,
.score-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.score-input[type=number] {
  -moz-appearance: textfield;
}

.separator {
    margin: 0 2px;
}

.btn-save-score {
  padding: 6px 10px;
  font-size: 0.9rem;
  background-color: #66bb6a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  min-width: 40px;
}
.btn-save-score:hover {
  background-color: #43a047;
}
.btn-save-score:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
}

.btn-cancel-edit {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    margin-left: 5px;
    padding: 5px;
    line-height: 1;
    color: #ef5350;
}
.btn-cancel-edit:hover {
    color: #c62828;
}

.error-message-inline {
    position: absolute;
    bottom: -18px;
    left: 0;
    font-size: 0.8rem;
    color: #c62828;
    width: 100%;
}

.btn-secondary {
  padding: 8px 15px;
  font-size: 0.9rem;
  background-color: #78909c;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.btn-secondary:hover {
  background-color: #546e7a;
}

.add-team-btn {
  /* Hérite de btn-secondary */
}

.item-list.team-list li {
  /* Styles existants pour les li */
}

.ranking-section {
    background-color: #f5f5f5;
}
.ranking-title {
    color: #333;
    text-align: center;
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 20px;
}
.ranking-table {
  width: 100%;
  border-collapse: collapse; /* Fusionner les bordures */
  margin-top: 15px;
  font-size: 0.9rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.ranking-table th, .ranking-table td {
  border: 1px solid #e0e0e0; /* Bordures grises légères */
  padding: 8px 10px;
  text-align: center;
}
.ranking-table th {
  background-color: #424242; /* En-tête gris foncé */
  color: white;
  font-weight: 600;
  border-color: #616161;
}
.ranking-table tbody tr:nth-child(even) {
  background-color: #fff;
}
.ranking-table tbody tr:hover {
  background-color: #fff9c4; /* Jaune très pâle au survol */
}
.ranking-table td:nth-child(2) { /* Colonne Nom équipe */
  text-align: left;
  font-weight: 500;
}
.ranking-table td:nth-child(3) { /* Colonne Points */
  font-weight: bold;
}
.loading-message-inline,
.error-message-inline {
    text-align: center;
    padding: 10px;
    margin-top: 10px;
    border-radius: 4px;
}
.loading-message-inline {
    color: #555;
}
.error-message-inline {
    color: #c62828; 
    background-color: #ffebee;
}
</style>
  