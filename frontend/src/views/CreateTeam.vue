<template>
    <div>
      <h2>Ajouter une équipe au tournoi</h2>
      <form @submit.prevent="addTeam">
        <div>
          <label for="teamName">Nom de l'équipe :</label>
          <input v-model="teamName" id="teamName" required />
        </div>
        <button type="submit">Ajouter l'équipe</button>
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
  