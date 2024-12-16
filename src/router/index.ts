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
      path: '/touch-visual',
      name: 'touch-visual',
      component: () => import('../view/TouchDistanceVisual.vue'),
    },
    {
      path: '/touch-date',
      name: 'touch-date',
      component: () => import('../view/TouchDistanceJustData.vue'),
    },
  ],
})

export default router
