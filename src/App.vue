<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Greet from "./components/Greet.vue";
</script>

<template>
  <main class="main-body">
    <i-svg-file-copy style="font-size: 50px; fill: red;"  @click="() => $router.push()"/>
    <i-ep-refresh />
    <Greet />

    <br />
    <div class="flex space-x-1">
      <router-link to="/">首页</router-link>
      <router-link to="/auth/register">注册</router-link>
      <router-link to="/auth/login">登录</router-link>
      <router-link to="/about">关于</router-link>
    </div>
    <div>
      <el-button>hello</el-button>
    </div>
    <router-view></router-view>
  </main>
</template>

<style lang="scss" scoped>
</style>
