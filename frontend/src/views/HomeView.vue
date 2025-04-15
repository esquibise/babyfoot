<template>
    <div>
      <h1>Liste des Tournois</h1>
      <ul>
        <li v-for="tournament in tournaments" :key="tournament.id">
            {{ tournament.name }} - {{ formatDate(tournament.date) }}
            <router-link :to="'/tournament/' + tournament.id">Voir le tournoi</router-link>
        </li>
        <router-link to="/create">Créer un tournoi</router-link>

      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const tournaments = ref([]);
  
  const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR');
};

  onMounted(async () => {
    const response = await fetch('http://localhost:3001/api/tournaments');
    tournaments.value = await response.json();
  });
  </script>
  