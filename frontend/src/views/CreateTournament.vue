<template>
    <div class="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-lg">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Créer un tournoi</h1>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nom :</label>
          <input v-model="name" id="name" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
  
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date :</label>
          <input v-model="date" id="date" type="date" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
  
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description :</label>
          <textarea v-model="description" id="description" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
  
        <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150">Créer</button>
      </form>
  
      <p v-if="successMessage" class="mt-4 text-green-600">{{ successMessage }}</p>
      <p v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</p>
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
  /* Supprimer tout le contenu ici */
  </style>
  