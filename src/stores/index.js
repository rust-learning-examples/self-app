import { createPinia as createVuePinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { storage } from '@/services'

export const createPinia = () => {
  const pinia = createVuePinia()
  pinia.use(createPersistedState({
    storage,
    key: id => `__persisted__${id}`,
    beforeRestore: (ctx) => {
      console.log(`about to restore '${ctx.store.$id}'`)
    },
    afterRestore: (ctx) => {
      console.log(`just restored '${ctx.store.$id}'`)
    },
  }))
  return pinia
}