<template>
    <el-menu class="left-side" :defaultActive="defalutActive" :defaultOpeneds="defaultOpeneds">
        <template v-for="route in routes">
            <template v-if="route.children?.length">
                <el-sub-menu :index="route.name">
                    <template #title>{{ route.meta.title }}</template>
                    <template v-for="route in route.children">
                        <el-menu-item :index="route.name" @click="onMenuItemClick(route)">{{ route.meta.title }}</el-menu-item>
                    </template>
                </el-sub-menu>
            </template>
            <template v-else>
                <el-menu-item :index="route.name" @click="onMenuItemClick(route)">{{ route.meta.title }}</el-menu-item>
            </template>
        </template>
    </el-menu>
</template>

<script>
import { defineComponent, reactive, toRefs, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
    setup() {
        const router = useRouter()
        const route = useRoute()

        const state = reactive({
            defalutActive: computed(() => route.name),
            defaultOpeneds: computed(() => {
                if (!route) return []
                const parentRotues = []
                let parentRoute = router.getParentRoute(route)
                while (parentRoute) {
                    parentRotues.splice(0, 0, parentRoute)
                    parentRoute = router.getParentRoute(parentRoute)
                }
                return parentRotues.map(route => route.name)
            }),
            routes: computed(() => [
                router.getRoute('home'),
                router.getRoute('topics'),
                router.getRoute('others'),
            ])
        })

        return {
            ...toRefs(state),
            onMenuItemClick(route) {
                router.push({name: route.name})
            }
        }
    }
})
</script>

<style lang="scss" scoped>
    .left-side {
        height: 100%;
    }
</style>