import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CreateTournament from '../views/CreateTournament.vue';
import TournamentView from '../views/TournamentView.vue';
import CreateTeam from '../views/CreateTeam.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/create', component: CreateTournament },
  { path: '/tournament/:id', component: TournamentView, name: 'TournamentView' },
  {
    path: '/tournament/:id/add-team',
    name: 'CreateTeam',
    component: CreateTeam,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
