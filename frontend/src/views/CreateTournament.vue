<template>
    <div class="view-container form-container">
      <h1 class="view-title">Créer un tournoi</h1>
      <form @submit.prevent="handleSubmit" class="tournament-form">
        <div class="form-group">
          <label for="name" class="form-label">Nom :</label>
          <input v-model="name" id="name" required class="form-input" />
        </div>
  
        <div class="form-group">
          <label for="date" class="form-label">Date :</label>
          <input v-model="date" id="date" type="date" required class="form-input" />
        </div>
  
        <div class="form-group">
          <label for="description" class="form-label">Description :</label>
          <textarea v-model="description" id="description" rows="4" class="form-textarea" />
        </div>
  
        <button type="submit" class="btn btn-submit btn-primary">Créer</button>
      </form>
  
     
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const name = ref('');
  const date = ref('');
  const description = ref('');
  const router = useRouter();
  
  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.value,
          date: date.value,
          description: description.value
        })
      });
  
      if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Erreur inconnue' }));
          throw new Error(errorData.message || 'Erreur lors de la création du tournoi.');
      }
  
      const data = await res.json();
      name.value = ''; 
      date.value = '';
      description.value = '';
  
     
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      console.error("Submit error:", err);
     
    }
  };
  </script>
  
<style scoped>
.tournament-form {
  display: flex;
  flex-direction: column;
  gap: 25px; 
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  padding: 12px 15px; 
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  background-color: #fdfdfd;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  background-color: #fff;
  transform: scale(1.0); 
}


.btn {
  display: inline-block;
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.btn-submit {
  background-color: #d32f2f; 
  color: white;
  align-self: center; 
  margin-top: 10px;
}

.btn-submit:hover {
  background-color: #b71c1c; 
}

.btn-primary {
  background-color: #d32f2f; 
  color: white;
}

.btn-primary:hover {
  background-color: #b71c1c;
}
</style>
  