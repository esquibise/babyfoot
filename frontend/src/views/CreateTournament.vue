<template>
    <div>
      <h1>Créer un tournoi</h1>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="name">Nom :</label>
          <input v-model="name" id="name" required />
        </div>
  
        <div>
          <label for="date">Date :</label>
          <input v-model="date" id="date" type="date" required />
        </div>
  
        <div>
          <label for="description">Description :</label>
          <textarea v-model="description" id="description" rows="3" />
        </div>
  
        <button type="submit">Créer</button>
      </form>
  
      <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const name = ref('');
  const date = ref('');
  const description = ref('');
  const successMessage = ref('');
  const errorMessage = ref('');
  const router = useRouter();
  
  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.value,
          date: date.value,
          description: description.value
        })
      });
  
      if (!res.ok) throw new Error('Erreur API');
  
      const data = await res.json();
      successMessage.value = `Tournoi "${data.name}" créé avec succès !`;
  
      // Optionnel : redirection vers l'accueil après 1s
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err) {
      errorMessage.value = 'Impossible de créer le tournoi.';
    }
  };
  </script>
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
  }
  input, textarea {
    padding: 5px;
  }
  button {
    padding: 8px;
    background-color: #007bff;
    border: none;
    color: white;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  </style>
  