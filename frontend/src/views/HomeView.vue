<template>
    <div class="view-container home-view-container">
      <h1 class="view-title">Liste des Tournois</h1>
      <ul>
        <li v-for="tournament in tournaments" :key="tournament.id" class="list-item">
            <span class="tournament-info">{{ tournament.name }} - {{ formatDate(tournament.date) }}</span>
            <router-link :to="{ name: 'TournamentView', params: { id: tournament.id } }" class="view-link">Voir</router-link>
        </li>
      </ul>
      <div class="create-link-container">
        <router-link to="/create" class="btn btn-primary">Créer un tournoi</router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { RouterLink } from 'vue-router'; // Assurez-vous que RouterLink est importé si nécessaire

  const tournaments = ref([]);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  onMounted(async () => {
    try {
      const response = await fetch('/api/tournaments');
      if (!response.ok) throw new Error('Network response was not ok');
      tournaments.value = await response.json();
    } catch (error) {
      console.error("Failed to fetch tournaments:", error);
      // Gérer l'erreur, par exemple afficher un message à l'utilisateur
    }
  });
  </script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0; /* Ajouter marge en bas */
  display: flex;
  flex-direction: column;
  gap: 12px; /* Espace un peu plus grand */
}

.list-item { /* Renommé pour clarté */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 25px;
  background-color: #ffffff; /* Blanc pour contraster avec le fond global */
  border: 1px solid #e0e0e0;
  border-left: 5px solid #66bb6a; /* Bordure verte plus épaisse */
  border-radius: 8px;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.list-item:hover {
  border-left-color: #2e7d32; /* Vert foncé au survol */
  background-color: #f9f9f9;
  transform: scale(1.02); /* Effet zoom léger */
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.tournament-info {
  color: #333;
  font-weight: 500;
}

.view-link {
  color: #1565c0; /* Bleu joueur */
  background-color: #e3f2fd;
  text-decoration: none;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 5px;
  transition: all 0.2s ease;
  border: 1px solid #bbdefb;
}

.view-link:hover {
  background-color: #1976d2; /* Bleu plus foncé */
  color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  border-color: #1976d2;
}

.create-link-container {
  margin-top: 30px;
  text-align: center;
}

/* Spécificité bouton primaire ici */
.btn-primary {
  background-color: #d32f2f; /* Rouge joueur */
  color: white;
}

.btn-primary:hover {
  background-color: #b71c1c;
}

</style>
  