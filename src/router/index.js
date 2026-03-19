import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'lobby',
    component: () => import('@/components/lobby/LobbyView.vue'),
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('@/components/gametable/GameTableView.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
