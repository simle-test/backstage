<template>
  <header class="header">
    <div class="header-inner">
      <div class="header-left">
        <div class="breadcrumb">
          <span class="breadcrumb-item">首页</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-item current">{{ currentPage }}</span>
        </div>
      </div>
      
      <div class="header-right">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input type="text" placeholder="搜索..." class="search-input">
        </div>
        
        <button class="icon-btn notification-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="notification-badge">3</span>
        </button>
        
        <button class="icon-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="1" stroke="currentColor" stroke-width="3"/>
            <circle cx="19" cy="12" r="1" stroke="currentColor" stroke-width="3"/>
            <circle cx="5" cy="12" r="1" stroke="currentColor" stroke-width="3"/>
          </svg>
        </button>
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
  justify-content: space-between;
  padding: 20px 32px;
  height: 80px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
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

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 320px;
  padding: 12px 16px 12px 48px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 14px;
  transition: all 0.3s;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1px solid var(--border-light);
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--text-secondary);
  position: relative;
}

.icon-btn:hover {
  border-color: var(--border-color);
  background: rgba(37, 99, 235, 0.08);
  color: var(--text-primary-color);
}

.icon-btn svg {
  width: 20px;
  height: 20px;
}

.notification-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  background: var(--primary-gradient);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
}
</style>
