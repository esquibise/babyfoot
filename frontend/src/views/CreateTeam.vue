<template>
    <div class="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Ajouter une équipe au tournoi</h2>
      <form @submit.prevent="addTeam" class="space-y-4">
        <div>
          <label for="teamName" class="block text-sm font-medium text-gray-700 mb-1">Nom de l'équipe :</label>
          <input v-model="teamName" id="teamName" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150">Ajouter l'équipe</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const teamName = ref('');
  const tournamentId = 1; // Remplacer par l'ID du tournoi
  
  const addTeam = async () => {
    const res = await fetch(`http://localhost:3001/api/tournaments/${tournamentId}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamName: teamName.value }),
    });
  
    if (res.ok) {
      alert('Équipe ajoutée !');
    } else {
      alert('Erreur lors de l\'ajout de l\'équipe.');
    }
  };
  </script>
  