import { reactive, onMounted } from 'vue'
export const useList = (options) => {
  console.log(options)
  console.assert(!options?.onload, 'must pass onload async function')
  const state = reactive({
    fetchCount: 0,
    isRefreshing: false,
    isLoading: false,
    isFinished: false,
    isError: false,
    errorInfo: null,
    list: [],
    pagination: {
      pageNo: 1,
      pageSize: 20,
      totalPage: 1,
      totalCount: 0
    },
    async initData() {
      Object.assign(state, {
        fetchCount: 0,
        isRefreshing: false,
        isLoading: false,
        isFinished: false,
        isError: false,
        errorInfo: null,
        list: [],
        pagination: {
          pageNo: 1,
          pageSize: 20,
          totalPage: 1,
          totalCount: 0
        },
      });
    },
    async onRefresh() {
      // 清空列表数据
      state.list = []
      state.isFinished = false
      state.isRefreshing = true
      await state.onLoad()
    },
    async onLoad() {
      state.isLoading = true
      state.fetchCount++
      if (state.isRefreshing) {
        state.list = []
        state.isRefreshing = false
      }
      await options.onLoad().then(data => {
        state.isError = false
        state.errorInfo = null
        return data
      }).catch(err => {
        state.isError = true
        state.errorInfo = err
      }).finally(() => {
        state.isLoading = false
      })
    }
  })
  return state
}