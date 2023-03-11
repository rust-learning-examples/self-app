import { createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { useRouter, useRoutes } from '@/utils/hooks/useRouter'
import Home from '@/views/home'

export const createRouter = () => {
  const router = useRouter(createVueRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: useRoutes([
      { path: '/', name: 'home', meta: {title: "首页"}, component: Home },
      { path: '/auth', redirect: '/auth', component: () => import('@/views/auth'), children: [
          { path: 'login', name: 'auth/login', component: () => import('@/views/auth/login') },
          { path: 'register', name: 'auth/register', component: () => import('@/views/auth/register') },
        ]
      },
      { path: '/controlPanel', name: 'controlPanel', component: () => import('@/views/controlPanel') },
      { path: '/about', name: 'about', component: () => import('@/views/about') }
    ])
  }))
  return router
}
