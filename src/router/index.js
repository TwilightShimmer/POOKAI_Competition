import { createRouter, createWebHistory } from 'vue-router'
import {
  getCurrentSeason,
  getEffectiveBinding,
  getPrdThemes,
  getThemeById,
  seedPrdData,
} from '@/mock/prdDb.js'

function defaultPathForRole(role) {
  if (role === 'student') {
    const binding = getBindingForSession()
    const theme = binding ? getThemeById(binding.themeId, getPrdThemes()) : null
    return binding && theme?.contentReady ? '/tasks' : '/student'
  }

  return {
    org: '/org',
    platform: '/platform',
  }[role] || '/'
}

function getSessionRole() {
  return JSON.parse(localStorage.getItem('pook_role') || '"student"')
}

function getBindingForSession() {
  const season = getCurrentSeason()
  const userPhone = localStorage.getItem('pook_user_phone') || ''
  if (!season || !userPhone) return null
  return getEffectiveBinding(userPhone, season.id)
}

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/HomeView.vue'), meta: { noAuth: true } },
  {
    path: '/theme-intro',
    name: 'ThemeIntro',
    component: () => import('@/views/ThemeIntroView.vue'),
    meta: { noAuth: true },
  },
  { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue'), meta: { noAuth: true } },
  { path: '/student', name: 'Student', component: () => import('@/views/StudentView.vue'), meta: { role: 'student' } },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('@/views/TasksView.vue'),
    meta: { role: 'student', bindingRequired: true, contentReadyRequired: true },
  },
  {
    path: '/tasks/:taskId/learn',
    name: 'TaskLearn',
    component: () => import('@/views/TaskLearnView.vue'),
    meta: { role: 'student', bindingRequired: true, contentReadyRequired: true },
  },
  { path: '/assistant', name: 'Assistant', component: () => import('@/views/AssistantView.vue'), meta: { role: 'student' } },
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: () => import('@/views/KnowledgeView.vue'),
    meta: { role: 'student', bindingRequired: true, contentReadyRequired: true },
  },
  {
    path: '/knowledge/tree',
    name: 'KnowledgeTree',
    component: () => import('@/views/KnowledgeTreeView.vue'),
    meta: { role: 'student', bindingRequired: true, contentReadyRequired: true },
  },
  {
    path: '/knowledge/tree-growth',
    name: 'KnowledgeGrowthTree',
    redirect: '/knowledge/tree',
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('@/views/ReportView.vue'),
    meta: { role: 'student', bindingRequired: true, contentReadyRequired: true },
  },
  {
    path: '/bump',
    name: 'Bump',
    component: () => import('@/views/BumpView.vue'),
    meta: { role: 'student', bindingRequired: true, contentReadyRequired: true },
  },
  {
    path: '/bump/scan',
    name: 'BumpScan',
    component: () => import('@/views/BumpScanView.vue'),
    meta: { role: 'student', bindingRequired: true, contentReadyRequired: true },
  },
  {
    path: '/share',
    name: 'SharePoster',
    component: () => import('@/views/SharePosterView.vue'),
    meta: { role: 'student', bindingRequired: true, contentReadyRequired: true },
  },
  { path: '/org', name: 'Org', component: () => import('@/views/OrgView.vue'), meta: { role: 'org' } },
  {
    path: '/platform',
    name: 'Platform',
    component: () => import('@/views/PlatformView.vue'),
    meta: { role: 'platform' },
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  seedPrdData()

  const isLoggedIn = localStorage.getItem('pook_logged_in') === 'true'
  const role = getSessionRole()
  const binding = getBindingForSession()

  if (to.meta.noAuth) {
    if (to.path === '/login' && isLoggedIn) next(defaultPathForRole(role))
    else next()
    return
  }

  if (!isLoggedIn) {
    next('/login')
    return
  }

  if (to.meta.role && to.meta.role !== role) {
    next(defaultPathForRole(role))
    return
  }

  if (to.meta.bindingRequired && !binding) {
    next('/student')
    return
  }

  if (to.meta.contentReadyRequired) {
    const theme = binding ? getThemeById(binding.themeId, getPrdThemes()) : null
    if (!binding || !theme?.contentReady) {
      next('/student')
      return
    }
  }

  next()
})

export default router
