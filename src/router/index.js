import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CategoryDetail from '../views/Category.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/category/:id',
    component: Category,
    name: 'Category'
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
