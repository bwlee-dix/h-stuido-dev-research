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
      path: '/complete-rate',
      name: 'complete-rate',
      component: () => import('@/view/CompleteRateView.vue'),
    },
  ],
})

export default router
