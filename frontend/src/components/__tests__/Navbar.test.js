import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import Navbar from '../Navbar.vue';

// Mock le routeur car Navbar utilise <router-link>
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/create', component: { template: '<div>Create</div>' } }
    ],
});

describe('Navbar.vue', () => {
    it('renders the brand name correctly', () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router]
            }
        });
        // Vérifie que le texte contient 'Babyfoot Manager'
        expect(wrapper.text()).toContain('Babyfoot Manager');
    });

    it('renders navigation links', () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router]
            }
        });
        // Trouve tous les liens de navigation
        const links = wrapper.findAll('.navbar-link'); // Utilise la classe CSS définie
        expect(links.length).toBe(2);
        expect(links[0].text()).toBe('Accueil');
        expect(links[1].text()).toBe('Nouveau Tournoi');
    });
}); 