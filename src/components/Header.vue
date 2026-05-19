<template>
  <header class="header">
    <div class="header-inner">
      <div class="breadcrumb">
        <span class="breadcrumb-item">首页</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item current">{{ currentPage }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentPage = computed(() => {
  const pageMap: Record<string, string> = {
    '/questions': '题目管理',
    '/bank': '题库管理',
    '/users': '用户管理',
    '/statistics': '统计分析'
  }
  return pageMap[route.path] || '首页'
})
</script>

<style scoped lang="css">
.header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-light);
  position: relative;
  z-index: 10;
}

.header::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  opacity: 0.2;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 32px;
  height: 80px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
}

.breadcrumb-item {
  font-size: 14px;
  color: var(--text-muted);
  transition: color 0.3s;
}

.breadcrumb-item.current {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: 'Noto Serif SC', serif;
  letter-spacing: 1px;
}

.breadcrumb-separator {
  color: var(--text-muted);
  font-size: 14px;
}
</style>
