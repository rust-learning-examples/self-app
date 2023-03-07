import axios from 'axios'
import supportMetaCancelToken from './supportMetaCancelToken'
import { useUserStore } from '@/stores/user'
import router from '@/router'
// import NProgress from 'nprogress'

// 创建 api 实例
const apiAxios = new Proxy(axios.create({
  // https://cn.vitejs.dev/guide/env-and-mode.html
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || '/',
  timeout: 1000 * 60,
  //withCredentials: true
}), {
  get(target, ...args) {
    return Reflect.get(target, ...args) || Reflect.get(axios, ...args)
  }
})
//apiAxios.CancelToken = axios.CancelToken
//apiAxios.isCancel = axios.isCancel
//Object.keys(axios).forEach(key => {
//  if (axios.hasOwnProperty(key) && !apiAxios.hasOwnProperty(key)) {
//    apiAxios[key] = axios[key]
//  }
//})
apiAxios.defaults.meta = {
  autoTrimParams: true,
  autoTrimData: true,
  // 请求重试
  retry: 0/*times*/, retryDelay: 100/*ms*/, curRetry: 0/*times*/,
  // 断开相同请求，判断条件 如果!!cancelToken存在 则计算config.url+cancelToken的值作为唯一key值，key值相同，则断开之前请求 (仅支持get请求)
  cancelToken: '',
  withProgressBar: false,
  success: null, // { message: '' },
  error: null, //{ message: '' }
}
// 设置 post 请求头
// apiAxios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

supportMetaCancelToken(apiAxios)

// 请求拦截
apiAxios.interceptors.request.use(async config => {
  // if (config.meta?.withProgressBar) { NProgress.start() }
  if (/get/.test(config.method) && config.meta?.autoTrimParams) {
    config.params = trimParams(config.params)
  }
  if (!/get/.test(config.method) && config.meta?.autoTrimData) {
    config.data = trimParams(config.data)
  }

  const userStore = useUserStore()
  const { token: accessToken } = userStore.authInfo || {}
  if (accessToken) {
   config.headers.Authorization ||= `${ accessToken }`
  }
  // if (!Object.prototype.hasOwnProperty.call(config.params || {}, 'sign')) {
  //   const sign = getSignature(config)
  //   config.params = { sign, ...config.params }
  // }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截
apiAxios.interceptors.response.use(async res => {
  const userStore = useUserStore()
  // if (res.config.meta?.withProgressBar) { NProgress.done() }
  // 请求成功
  if (`${res.data.errorCode}` !== '0') {
    if (!Object.prototype.hasOwnProperty.call(res.data, 'errorCode') && !Object.prototype.hasOwnProperty.call(res.data, 'errorMsg')) {
      return Promise.resolve(res)
    }
    if (`${res.data.errorCode}` === '401') {
      showMessage('Token校验失败')
      const result = await userStore.clearLoginInfo()
      if (result !== 'locationHref') {
        router.push({name: 'auth/login'})
      }
    } else {
      const errorMessage = res.data.errorMsg || res.data || '网络错误'
      showMessage(errorMessage)
    }
    return Promise.reject(res.data)
  }
  if (res.config.meta?.success?.message) {
    const { type = 'success', message } = res.config.meta.success
    showMessage({ type, message})
  }
  return Promise.resolve(res)
}, error => {
  // 请求失败
  if (axios.isCancel(error)) {
    console.error('主动取消')
  } else {
    const config = error.config
    if (config?.meta && config.meta.curRetry !== config.meta.retry) {
      config.meta.curRetry++
      return new Promise(resolve => {
        setTimeout(() => {
          console.warn(`${config.url},请求重试: ${config.meta.curRetry}次`)
          resolve(apiAxios(config))
        }, config.meta.retryDelay)
      })
    } else if (!/^2/.test(`${error.state}`)) {
      let errorMessage = ''
      if (error.code === 'ECONNABORTED') {
        errorMessage = '请求超时'
      } else {
        errorMessage = error.response?.data?.errorMsg || '网络错误'
      }
      showMessage(errorMessage)
    }
  }
  return Promise.reject(error)
})
export default apiAxios

export function trimParams(params) {
  const newParams = {}
  for (const key in params) {
    if ([undefined, null, ''].indexOf(params[key]) === -1) {
      newParams[key] = params[key]
    } else if (!Array.isArray(params[key]) && params[key] instanceof Object) {
      newParams[key] = trimParams(params[key])
    }
  }
  return newParams
}


function showMessage(message) {
  message = Object.assign({message: '', type: 'error'}, message instanceof Object ? message : {  message })
  console.log('showMessage', message)
}