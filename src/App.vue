<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import Greet from "./components/Greet.vue";
</script>

<template>
  <el-config-provider size="small" :z-index="3000">
    <BaseLayout class="main-body">
      <template #main>
        <router-view></router-view>
      </template>
    </BaseLayout>
  </el-config-provider>
</template>

<style lang="scss" scoped>
</style>
