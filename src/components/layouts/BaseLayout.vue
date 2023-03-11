<script setup>
import { useSlots } from 'vue'
const slots = useSlots()
</script>

<template>
    <el-container>
        <el-aside width="200px">
            <slot name="aside">
                <LeftSide></LeftSide>
            </slot> 
        </el-aside>
      <el-container>
        <el-main>
            <div class="header">
                <Breadcrumb></Breadcrumb>
            </div>
            <slot name="main">main</slot> 
        </el-main>
        <el-footer v-if="slots.footer">
            <slot name="footer"></slot> 
        </el-footer>
      </el-container>
    </el-container>
</template>