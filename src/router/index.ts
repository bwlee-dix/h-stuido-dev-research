import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../view/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../view/AboutView.vue'),
    },
    {
      path: '/touch-distance',
      name: 'touch-distance',
      component: () => import('../view/TouchDistance.vue'),
    },
  ],
})

export default router
