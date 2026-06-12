<template>
  <header class="header">
    <div class="header-inner">
      <div class="page-title">{{ currentPage }}</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentPage = computed(() => {
  const path = route.path
  if (path.includes('/users')) return '用户管理'
  if (path.includes('/statistics')) return '数据分析'
  if (path.includes('/batch-import')) return '批量导入'
  if (path.includes('/questions')) return '题目管理'
  return '首页'
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
  opacity: 0.3;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 32px;
  height: 70px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: 'Noto Serif SC', serif;
  letter-spacing: 2px;
}
</style>
