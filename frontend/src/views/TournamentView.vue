<template>
    <div v-if="tournament" class="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-3xl font-bold mb-4 text-gray-800">{{ tournament.name }}</h1>
      <p class="mb-2 text-gray-600"><strong>Date :</strong> {{ formatDate(tournament.date) }}</p>
      <p class="mb-6 text-gray-600"><strong>Description :</strong> {{ tournament.description || 'Non fournie' }}</p>
  
      <div class="mb-6">
        <h2 class="text-2xl font-semibold mb-3 text-gray-700">Équipes</h2>
        <ul v-if="tournament.teams && tournament.teams.length" class="space-y-2">
          <li v-for="(team, index) in tournament.teams" :key="index" class="p-2 bg-gray-50 rounded">{{ team }}</li>
        </ul>
        <p v-else class="text-gray-500">Aucune équipe inscrite.</p>
      </div>

      <div>
        <h2 class="text-2xl font-semibold mb-3 text-gray-700">Matchs</h2>
        <ul v-if="tournament.matches && tournament.matches.length" class="space-y-2">
          <li v-for="(match, index) in tournament.matches" :key="index" class="p-2 bg-gray-50 rounded">
            {{ match.team1 }} vs {{ match.team2 }}
            <span v-if="match.scoreTeam1 != null" class="font-semibold"> → {{ match.scoreTeam1 }} - {{ match.scoreTeam2 }}</span>
          </li>
        </ul>
        <p v-else class="text-gray-500">Aucun match encore généré.</p>
      </div>
    </div>
    <div v-else class="text-center p-10">
      <p class="text-gray-500">Chargement...</p>
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
  