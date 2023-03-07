import { defineStore } from 'pinia'
import { loginApi, getUserInfoApi } from '@/api'

export const useUserStore = defineStore('userStore', {
  state: () => {
    return {
      authInfo: null,
      userInfo: null
    }
  },
  getters: {
    isLogin: (state) => !!state.authInfo?.accessToken,
  },
  actions: {
    async login(data) {
      const {data: rData} = await loginApi({
        ...data
      })
      this.authInfo = rData.data
      await this.getUserInfo()
    },
    async getUserInfo() {
      const {data: rData} = await getUserInfoApi()
      this.userInfo = rData.data
    },
    clearLoginInfo() {
      this.authInfo = null
      this.userInfo = null
    }
  },
  persist: {
    // key: 'desktopStore', // default: store.$id
    // storage: localStorage, // default: localStorage
    paths: ['authInfo', 'userInfo'],
    debug: import.meta.env.MODE === 'development'
  }
})