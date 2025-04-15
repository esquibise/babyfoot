<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand">
        Babyfoot Manager <span class="soccer-icon">⚽</span>
      </router-link>
      <div class="navbar-links">
        <router-link to="/" class="navbar-link">Accueil</router-link>
        <router-link to="/create" class="navbar-link">Nouveau Tournoi</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.navbar {
  /* Dégradé linéaire pour un effet bois plus nuancé */
  background: linear-gradient(to bottom, #6d4c41, #5d4037);
  color: white;
  padding: 12px 20px; /* Léger ajustement du padding */
  box-shadow: 0 3px 6px rgba(0,0,0,0.15); /* Ombre légèrement plus prononcée */
}

.navbar-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  color: white;
  text-decoration: none;
  font-size: 1.6rem; /* Légèrement plus grand */
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.4); /* Ombre portée sur le texte */
  display: inline-flex; /* Pour aligner l'icône */
  align-items: center;
}

.soccer-icon {
  display: inline-block;
  margin-left: 8px;
  font-size: 1.4rem; /* Ajuster si nécessaire */
  transition: transform 0.5s ease-in-out;
}

.navbar-brand:hover {
  color: #efebe9;
}

.navbar-brand:hover .soccer-icon {
  transform: rotate(360deg); /* Rotation au survol du lien */
}

.navbar-links a {
  color: white;
  text-decoration: none;
  margin-left: 15px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.navbar-links a:hover {
  background-color: #795548; /* Marron plus clair et distinct */
  transform: translateY(-1px); /* Léger soulèvement */
}

.navbar-links a:active {
  transform: translateY(0px); /* Effet clic */
}
</style> 