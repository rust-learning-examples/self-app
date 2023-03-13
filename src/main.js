import * as services from './services'

(async () => {
  await services.globalInitServiceAsync()
  const { createVueApp } = await import('./app')
  const app = createVueApp()
  await services.afterAppInitServiceAsync()
  app.mount("#app");
})()