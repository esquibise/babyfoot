<template>
    <div class="view-container form-container team-form-container">
      <h2 class="view-title form-title">Ajouter une équipe au tournoi</h2>
      <form @submit.prevent="addTeam" class="team-form">
        <div class="form-group">
          <label for="teamName" class="form-label">Nom de l'équipe :</label>
          <input v-model="teamName" id="teamName" required class="form-input" />
        </div>
        <button type="submit" class="btn btn-submit btn-secondary" :disabled="!tournamentId">Ajouter l'équipe</button>
        <p v-if="!tournamentId" class="error-message">ID du tournoi manquant.</p>
      </form>
       
       <p v-if="errorMsg && !tournamentId" class="error-message">{{ errorMsg }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps } from 'vue';
  import { useRouter } from 'vue-router'; 
  

  const props = defineProps({
    id: { 
      type: [String, Number],
      required: true
    }
  });
  
  const teamName = ref('');
  const tournamentId = ref(props.id); 
  const successMsg = ref('');
  const errorMsg = ref('');
  const router = useRouter(); 
  
  const addTeam = async () => {
    if (!tournamentId.value) {
        errorMsg.value = "ID du tournoi non spécifié.";
        return;
    }
    if (!teamName.value.trim()) { 
        console.error("Le nom de l'équipe ne peut pas être vide.");
        return;
    }

    try {
        const res = await fetch(`/api/tournaments/${tournamentId.value}/teams`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamName: teamName.value.trim() }), // Utiliser trim()
        });
    
        const data = await res.json();
        if (!res.ok) {
            
            throw new Error(data.error || `Erreur ${res.status} lors de l'ajout.`);
        }
        
        successMsg.value = `Équipe "${teamName.value.trim()}" ajoutée avec succès !`;
        teamName.value = ''; 

        setTimeout(() => {
           router.push({ name: 'TournamentView', params: { id: tournamentId.value } });
        }, 1500);

    } catch (error) {
        console.error("Error adding team:", error);
        
    }
  };
  </script>

<style scoped>

.form-title {
    font-size: 1.9rem; 


.team-form {
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
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-input {
  padding: 12px 15px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  background-color: #fdfdfd;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  background-color: #fff;
  transform: scale(1.0);
}

.btn-secondary {
  background-color: #1976d2; 
  color: white;
}
.btn-secondary:hover {
  background-color: #1565c0;
}


</style>
