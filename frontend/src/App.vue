<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'); /* Import d'une police plus moderne */

body {
  margin: 0;
  font-family: 'Poppins', sans-serif; 
  background-color: #2E7D32;
  background-image: radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%);
  color: #333; 
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding: 25px; 
}

.view-container {
    max-width: 950px;
    margin: 20px auto;
    padding: 30px;
    background-color: rgba(255, 255, 255, 0.95); 
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0,0,0,0.05);
    animation: fadeIn 0.5s ease-out; 
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}


.view-title {
    color: #1a237e; 
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 30px;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}


.btn {
  display: inline-block;
  padding: 10px 22px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600; 
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0,0,0,0.15);
}

.btn:active {
  transform: translateY(0px);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

</style>
