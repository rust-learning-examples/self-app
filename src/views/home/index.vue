<template>
  <main class="page">
    <el-row :gutter="15">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card header="搜索" shadow="hover">
          <el-space wrap size="large">
            <el-link href="https://www.google.com/" target="_blank" title="Vite">Google</el-link>
            <el-link href="https://www.baidu.com/" target="_blank" title="Vite">百度</el-link>
            <el-link href="https://github.com/" target="_blank" title="Vite">Github</el-link>
            <el-link href="https://stackoverflow.com/" target="_blank" title="Vite">Stackoverflow</el-link>
            <el-link href="https://www.zhihu.com/" target="_blank" title="Vite">知乎</el-link>
          </el-space>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card header="前端" shadow="hover">
          <el-space wrap size="large">
            <el-link href="https://cn.vitejs.dev/" target="_blank" title="Vite">Vite</el-link>
            <el-link href="https://cn.vuejs.org/" target="_blank" title="Vue">Vue</el-link>
            <el-link href="https://router.vuejs.org/" target="_blank" title="VueRouter">VueRouter</el-link>
            <el-link href="https://pinia.vuejs.org/" target="_blank" title="Pinia">Pinia</el-link>
            <el-link href="https://zh-hans.reactjs.org/" target="_blank" title="React">React</el-link>
            <el-link href="https://reactrouter.com/" target="_blank" title="ReactRouter">ReactRouter</el-link>
            <el-link href="https://tailwindcss.com/" target="_blank" title="Tailwindcss">Tailwindcss</el-link>
          </el-space>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card header="设计" shadow="hover">
          <el-space wrap size="large">
            <el-link href="https://hao.uisdc.com/" target="_blank" title="优设导航">优设导航</el-link>
            <el-link href="https://www.iconfont.cn/" target="_blank" title="Iconfont">Iconfont</el-link>
            <el-link href="https://brandcolors.net/" target="_blank" title="VueRouter">Brandcolors</el-link>
            <el-link href="https://www.58pic.com/" target="_blank" title="千图网">千图网</el-link>
            <el-link href="https://unsplash.com/" target="_blank" title="unsplash">Unsplash</el-link>
          </el-space>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card header="翻译" shadow="hover">
          <el-space wrap size="large">
            <el-link href="https://translate.volcengine.com/translate" target="_blank" title="Vite">火山翻译</el-link>
            <el-link href="https://fanyi.youdao.com/index.html" target="_blank" title="Vite">有道翻译</el-link>
            <el-link href="https://translate.google.com.hk/" target="_blank" title="Vite">Google翻译</el-link>
          </el-space>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card header="正则匹配(Regex)" shadow="hover">
          <div><el-link href="https://rubular.com" target="_blank" title="Ruby rubular">rubular for Ruby</el-link></div>
          <div><el-link href="https://regexr.com/" target="_blank" title="regexr">regexr for Javascript</el-link></div>
          <div><el-link href="https://regex101.com/" target="_blank" title="regex101">regex101</el-link></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card header="数据比较(Data Diff)" shadow="hover">
          <div><el-link href="https://www.diffchecker.com" target="_blank" title="diffchecker">Text Diff(diffchecker)</el-link></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card header="数据加密解密" shadow="hover">
          <div><el-link href="https://tool.oschina.net/encrypt" target="_blank" title="oschina">Crypto-JS实现</el-link></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card header="JSON工具" shadow="hover">
          <div><el-link href="http://jsoneditoronline.org/" target="_blank" title="json editor">Json Editor</el-link></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card header="在线绘图" shadow="hover">
          <div><el-link href="https://www.processon.com/" target="_blank" title="ProcessOn diagrams">ProcessOn</el-link></div>
          <div>
              <el-link href="https://app.diagrams.net/" target="_blank" title="diagrams">drawio</el-link>
              (包含<el-link href="https://github.com/jgraph/drawio-desktop/releases" target="_blank">客户端</el-link>)
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card header="文档/图片/视频等在线转换" shadow="hover">
          <div><el-link href="https://www.aconvert.com/cn/" target="_blank" title="aconvert.com">Aconvert</el-link></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card header="其他" shadow="hover">
          <div><el-link href="https://crontab.guru/" target="_blank" title="crontab">Crontab(分时日月周)</el-link></div>
        </el-card>
      </el-col>
    </el-row>
  </main>
</template>

<style lang="scss" scoped>
.page {
  padding: 15px;
}

.el-col {
  margin-bottom: 15px;
  .el-card {
    height: 100%;

    .el-link {
      @apply underline underline-offset-4;
    }
  }
}
</style>