<template>
    <div class="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Liste des Tournois</h1>
      <ul class="space-y-4">
        <li v-for="tournament in tournaments" :key="tournament.id" class="p-4 border rounded-md flex justify-between items-center hover:bg-gray-50 transition duration-150">
            <span class="text-gray-700">{{ tournament.name }} - {{ formatDate(tournament.date) }}</span>
            <router-link :to="'/tournament/' + tournament.id" class="text-blue-600 hover:text-blue-800 hover:underline">Voir le tournoi</router-link>
        </li>
      </ul>
      <div class="mt-6">
        <router-link to="/create" class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150">Créer un tournoi</router-link>
      </div>
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
  