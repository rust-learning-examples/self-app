import { createApp } from "vue";
import "./assets/stylesheets/application.scss";
import { createPinia } from 'pinia'
import { createRouter } from './router'
import dayjs from 'dayjs'

import App from "./App.vue";

const app = createApp(App)
app.use(createPinia())
.use(createRouter())

Object.defineProperties(app.config.globalProperties, {
  $dayjs: {
    get: () => dayjs
  },
  $isDev: {
    get: () => import.meta.env.MODE === 'development'
  }
})

app.mount("#app");