<template>
    <div v-if="tournament">
      <h1>{{ tournament.name }}</h1>
      <p><strong>Date :</strong> {{ formatDate(tournament.date) }}</p>
      <p><strong>Description :</strong> {{ tournament.description }}</p>
  
      <h2>Équipes</h2>
      <ul v-if="tournament.teams && tournament.teams.length">
        <li v-for="(team, index) in tournament.teams" :key="index">{{ team }}</li>
      </ul>
      <p v-else>Aucune équipe inscrite.</p>
  
      <h2>Matchs</h2>
      <ul v-if="tournament.matches && tournament.matches.length">
        <li v-for="(match, index) in tournament.matches" :key="index">
          {{ match.team1 }} vs {{ match.team2 }} 
          <span v-if="match.scoreTeam1 != null"> → {{ match.scoreTeam1 }} - {{ match.scoreTeam2 }}</span>
        </li>
      </ul>
      <p v-else>Aucun match encore généré.</p>
    </div>
    <div v-else>
      <p>Chargement...</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const tournament = ref(null);
  
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };
  
  onMounted(async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/tournaments/${route.params.id}`);
      if (!res.ok) throw new Error('Erreur API');
      tournament.value = await res.json();
    } catch (err) {
      console.error('Erreur de récupération du tournoi :', err);
    }
  });
  </script>
  