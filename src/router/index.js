import { createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { useRouter, useRoutes } from '@/utils/hooks/useRouter'
import Home from '@/views/home'

export const createRouter = () => {
  const router = useRouter(createVueRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: useRoutes([
      { path: '/', name: 'home', meta: {title: "首页"}, component: Home },
      { path: '/topics', name: 'topics', meta: {title: "热门文章"}, component: () => import('@/views/topics') },
      { path: '/auth', redirect: '/auth', component: () => import('@/views/auth'), children: [
          { path: 'login', name: 'auth/login', component: () => import('@/views/auth/login') },
          { path: 'register', name: 'auth/register', component: () => import('@/views/auth/register') },
        ]
      },
      { path: '/controlPanel', name: 'controlPanel', component: () => import('@/views/controlPanel') },
      { path: '/about', name: 'about', component: () => import('@/views/about') },
      { path: '/others', name: 'others', meta: {title: '其他'}, component: () => import('@/views/others'), children: [
          { path: 'stocks', name: 'others/stocks', meta: { title: 'Stock' }, component: () => import('@/views/others/stocks') }
        ]
      }
    ])
  }))
  return router
}
