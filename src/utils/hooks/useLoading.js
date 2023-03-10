import { reactive } from 'vue'

export function useLoading() {
  const loadingState = reactive({
    value: false,
    data: null,
    times: 0,
    async load(executor) {
      console.assert(!!executor, '必须传递执行器')
      try {
        loadingState.value = true
        loadingState.data = null
        if (typeof executor === 'object' && typeof executor.then === 'function') {
          loadingState.data = await executor
        } else if (typeof executor === 'function') {
          loadingState.data = await executor()
        } else {
          loadingState.data = executor
        }
        this.times++
        return loadingState.data
      } finally {
        loadingState.value = false
      }
    }
  })
  return loadingState
}

//import { useLoading } from '@/utils/hooks/useLoading'
//const loading = useLoading()
//console.log(loading.value)
//loading.load(async() => {})