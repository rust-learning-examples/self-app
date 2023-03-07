import { createRouter as createVueRouter, createWebHashHistory } from 'vue-router'
import { useRouter, useRoutes } from '@/utils/hooks/useRouter'
import Home from '@/views/home'

export const createRouter = () => {
  const router = useRouter(createVueRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: useRoutes([
      { path: '/', name: 'home', component: Home },
      { path: '/auth', redirect: '/auth', component: () => import('@/views/auth'), children: [
          { path: 'login', name: 'auth/login', component: () => import('@/views/auth/login') },
          { path: 'register', name: 'auth/register', component: () => import('@/views/auth/register') },
        ]
      },
      { path: '/about', name: 'about', component: () => import('@/views/about') }
    ])
  }))
  return router
}
