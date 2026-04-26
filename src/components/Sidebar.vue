<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <Notebook class="logo-icon" />
        <span class="logo-text">刷题后台</span>
      </div>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      mode="vertical"
      background-color="#001529"
      text-color="#bfcbd9"
      active-text-color="#fff"
    >
      <el-menu-item index="/questions">
        <component :is="icons.Edit" />
        <span>题目管理</span>
      </el-menu-item>
      <el-menu-item index="/bank">
        <component :is="icons.Box" />
        <span>题库管理</span>
      </el-menu-item>
      <el-menu-item index="/users">
        <component :is="icons.User" />
        <span>用户管理</span>
      </el-menu-item>
      <el-menu-item index="/statistics">
        <component :is="icons.TrendCharts" />
        <span>统计分析</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notebook, Edit, Box, User, TrendCharts } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const icons = {
  Edit,
  Box,
  User,
  TrendCharts
}

const activeMenu = computed(() => route.path)

const handleMenuClick = (index: string) => {
  router.push(index)
}
</script>

<style scoped>
.sidebar {
  width: 200px;
  height: 100%;
  background-color: #001529;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #1f2d3d;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 24px;
  color: #409eff;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.sidebar-menu {
  height: calc(100% - 65px);
  border-right: none;
}
</style>