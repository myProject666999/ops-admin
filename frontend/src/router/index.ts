import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 常量路由
const constantRoutes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
  { path: '/', name: 'home', component: () => import('@/views/DashboardView.vue') },
  { path: '/log/operlog', name: 'operlog', component: () => import('@/views/log/operlog/index.vue') },
  { path: '/log/loginlog', name: 'loginlog', component: () => import('@/views/log/loginlog/index.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
})

// 重置路由
export function resetRouter() {
  // 路由已静态配置，无需重置
}

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (auth.hasExceededReopenIdleTimeout()) {
    await auth.cleanupSessionAfterReopenTimeout()
    if (to.path !== '/login') {
      return '/login'
    }
    return
  }
  const validSession = await auth.resumeSessionAfterReopen()
  if (to.path !== '/login' && !validSession) {
    return '/login'
  }
  if (to.path === '/login' && validSession) {
    return '/'
  }
})

export default router
