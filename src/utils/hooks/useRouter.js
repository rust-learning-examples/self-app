import { computed } from 'vue'
import NProgress from 'nprogress'
const useDefine = (route = {}) => {
  const { component, ...finalRoute } = route
  // meta
  finalRoute.meta = {
    ...finalRoute.meta,
    hasPermission: computed(() => true),
  }

  // component
  if (typeof route['component'] === 'function') {
    finalRoute['component'] = () => {
      const result = route['component']()
      if (typeof result === 'object' && typeof result.then === 'function') {
        NProgress.start()
        result.finally(() => {
          NProgress.done()
        })
      }
      return result
    }
  } else {
    finalRoute['component'] = component
  }
  return finalRoute
}

export const useRoutes = (routes) => {
  const iterateUseDefine = (route) => {
    if (route.children?.length) {
      route.children = route.children.map(route => iterateUseDefine(route))
    }
    return useDefine(route)
  }
  return routes.map(route => iterateUseDefine(route))
}

export const useRouter = (router) => {
  router.getRoute ||= (routeName) => {
    const routes = router.getRoutes()
    return routes.find(route => route.name === routeName)
  }
  router.getParentRoute ||= (route) => {
    const parentRouteName = route.name?.split('/').slice(0, -1).join('/')
    return parentRouteName ? router['getRoute'](parentRouteName) : null
  }

  router.beforeEach(async (to, from, next) => {
    next()
  })

  router.beforeResolve((to, from, next) => {
    next()
  })

  router.afterEach(async (to, from) => {
    if (to.meta?.fullTitle) {
      document.title = to.meta?.fullTitle
    } else {
      const title = to.meta?.title
      document.title =  (title ? `${title}-` : '') + 'VueApp'
    }
  })

  return router
}