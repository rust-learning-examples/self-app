<template>
  <el-card :body-style="{ padding: '0px' }">
    <template #header>
      <div class="flex justify-between">
        <span>知乎</span>
        <el-button-group>
          <el-button :type="activePeriod == 'hour' ? 'primary' : 'default'" @click="activePeriod = 'hour'; fetchData()">小时榜</el-button>
          <el-button :type="activePeriod == 'day' ? 'primary' : 'default'" @click="activePeriod = 'day'; fetchData()">日榜</el-button>
          <el-button :type="activePeriod == 'week' ? 'primary' : 'default'" @click="activePeriod = 'week'; fetchData()">周榜</el-button>
        </el-button-group>
      </div>
    </template>
    <el-tabs type="border-card" tab-position="top" v-model="activeTab" @tabChange="onTabChange">
      <template v-for="tab in tabs" :key="tab.value">
        <el-tab-pane :label="tab.label" :name="tab.value">
          <template v-for="post in posts" :key="post.article_id">
            <div><el-link :href="post.question?.url" target="_blank" :title="post.question?.title">{{ post.question?.title }}</el-link></div>
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>
  </el-card>
</template>
<script lang="jsx">
import { reactive, toRefs, defineComponent } from 'vue'
import * as http from '@tauri-apps/api/http'
export default defineComponent({
  setup (props, ctx) {
    const state = reactive({
      tabs: [{
        label: '全部',
        value: '0'
      }, {
        label: '互联网',
        value: '100003'
      }, {
        label: '商业财经',
        value: '100004'
      }, {
        label: '职场',
        value: '100005'
      }, {
        label: '军事',
        value: '100008'
      }, {
        label: '影视娱乐',
        value: '100022'
      }, {
        label: '美食',
        value: '100027'
      }],
      activeTab: '0',
      activePeriod: 'day',
      posts: [],
      async fetchData() {
        const response = await http.fetch('https://www.zhihu.com/api/v4/creators/rank/hot', {
          method: 'GET',
          query: {
            domain: state.activeTab,
            period: state.activePeriod,
          },
          headers: {
            'Host': 'https://www.zhihu.com/',
            'Content-Type': 'application/json',
          },
          responseType: http.ResponseType.JSON,
        })
        if (response.ok && response.data?.data?.length) {
          state.posts = response.data.data
        }
      },
      onTabChange() {
        state.fetchData()
      }
    })
    state.fetchData()
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
.el-link {
  @apply underline underline-offset-4;
}
</style>