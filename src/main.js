import { createApp, render } from "vue";
import "./assets/stylesheets/application.scss";
import { createPiniaAsync } from './stores'
import { createRouter } from './router'
import dayjs from 'dayjs'
import * as services from './services'

import App from "./App.vue";

(async () => {
  await services.globalInitServiceAsync()

  const app = createApp(App)
  app.use(await createPiniaAsync()).use(createRouter())

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

  await services.afterAppInitServiceAsync()
  app.mount("#app");
})()
