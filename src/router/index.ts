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
    {
      path: '/complete-timer',
      name: 'complete-timer',
      component: () => import('@/view/CompleteTimer.vue'),
    },
    {
      path: '/complete-rate',
      name: 'complete-rate',
      component: () => import('@/view/CompleteRateView.vue'),
    },
    {
      path: '/path-setting',
      name: 'path-setting',
      component: () => import('@/view/PathSettingView.vue'),
    },
    {
      path: '/path-setting-stat',
      name: 'path-setting-stat',
      component: () => import('@/view/PathSettingStatView.vue'),
    },
    {
      path: '/touch-distance',
      name: 'touch-distance',
      component: () => import('../view/TouchDistanceView.vue'),
    },
  ],
})

export default router
