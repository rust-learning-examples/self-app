<template>
  <el-breadcrumb class="breadcrumb" v-if="computedRoutes?.length">
    <template v-for="(routeItem, idx) in computedRoutes" :key="idx">
      <el-breadcrumb-item>
        {{ routeItem?.meta.title }}
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  props: {
    routes: [Array],
  },
  setup (props, ctx) {
    const router = useRouter()
    const route = useRoute()

    const state = reactive({
      computedRoutes: computed(() => {
        if (props.routes) {
          return props.routes
        }
        let curRoute = {...route}
        const routes = [curRoute]
        while (1) {
          curRoute = router.getParentRoute(curRoute)
          if (curRoute?.meta.title) {
            routes.push(curRoute)
          } else {
            break
          }
        }
        return routes.reverse()
      })
    })
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
.breadcrumb {
  margin-bottom: 10px;
}
</style>