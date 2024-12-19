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
      path: '/touch-count',
      name: 'touch-count',
      component: () => import('@/view/TouchCountView.vue'),
    },
    {
      path: '/touch-accuracy',
      name: 'touch-accuracy',
      component: () => import('@/view/TouchAccuracyView.vue'),
    },
  ],
})

export default router
