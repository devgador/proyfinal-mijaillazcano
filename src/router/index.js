import { createRouter, createWebHistory } from 'vue-router';
import Barberos from '../components/Barberos.vue';
import Citas from '../components/Citas.vue';
import Clientes from '../components/Clientes.vue';

const routes = [
  { path: '/', redirect: '/citas' }, 
  { path: '/citas', component: Citas },
  { path: '/barberos', component: Barberos },
  { path: '/clientes', component: Clientes },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;