import { createApp, render } from "vue";
import "./assets/stylesheets/application.scss";
import { createPinia } from './stores'
import { createRouter } from './router'
import dayjs from 'dayjs'

import App from "./App.vue";

export const createVueApp = () => {
  const app = createApp(App)
  app.use(createPinia()).use(createRouter())

  Object.defineProperties(app.config.globalProperties, {
    $dayjs: {
      get: () => dayjs
    },
    $isDev: {
      get: () => import.meta.env.MODE === 'development'
    }
  })
  app.render = (vnode, rootContainer) => {
    if (vnode && !vnode.appContext) vnode.appContext = app._context
    render(vnode, rootContainer)
  }
  return app
}


