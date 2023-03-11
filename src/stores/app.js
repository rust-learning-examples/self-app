import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', {
  state: () => {
    return {
      stock: {
        intervalUpdateMillisecond: 5 * 60 * 1000
      }
    }
  },
  persist: {
    // key: 'appStore', // default: store.$id
    // storage, // default: localStorage
    paths: null, // [] means no state is persisted and undefined or null means the whole state is persisted
    debug: import.meta.env.MODE === 'development'
  }
})