<template>
  <header class="header">
    <div class="header-left">
      <button class="sidebar-toggle" @click="toggleSidebar">
        <Menu class="toggle-icon" />
      </button>
      <div class="breadcrumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="header-right">
      <el-dropdown>
        <div class="user-info">
          <User class="user-icon" />
          <span>管理员</span>
          <ArrowDown class="arrow-icon" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, User, ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()

const titleMap: Record<string, string> = {
  '/questions': '题目管理',
  '/bank': '题库管理',
  '/users': '用户管理',
  '/statistics': '统计分析'
}

const currentTitle = computed(() => titleMap[route.path] || '首页')

const toggleSidebar = () => {
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.sidebar-toggle {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 18px;
  color: #666;
}

.toggle-icon {
  font-size: 20px;
}

.breadcrumbs {
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 20px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.user-icon {
  font-size: 18px;
  color: #666;
}

.arrow-icon {
  font-size: 14px;
  color: #999;
}
</style>