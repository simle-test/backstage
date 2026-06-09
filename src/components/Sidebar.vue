<template>
  <aside class="sidebar">
    <div class="sidebar-inner">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 48 48" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#2563eb"/>
                  <stop offset="50%" style="stop-color:#3b82f6"/>
                  <stop offset="100%" style="stop-color:#2563eb"/>
                </linearGradient>
              </defs>
              <rect width="48" height="48" rx="14" fill="url(#logoGrad)"/>
              <path d="M12 15h24M12 24h18M12 33h14" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
              <circle cx="36" cy="37" r="6" fill="#ffffff"/>
            </svg>
          </div>
          <span class="logo-text">行测题库</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div v-for="item in menuItems" :key="item.path" class="nav-group">
          <div 
            class="nav-item"
            :class="{ 
              'has-children': item.children && item.children.length > 0,
              'active': $route.path === item.path || $route.path.startsWith(item.path + '/')
            }"
            @click="item.children && item.children.length > 0 ? toggleMenu(item.path) : router.push(item.path)"
          >
            <span class="nav-text">{{ item.name }}</span>
            <div class="nav-icon-wrapper">
              <component :is="item.icon" class="nav-icon"/>
              <svg v-if="item.children && item.children.length > 0" viewBox="0 0 24 24" fill="none" class="arrow-icon" :class="{ expanded: expandedMenu === item.path }">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div v-if="item.children && item.children.length > 0" :class="['submenu', { expanded: expandedMenu === item.path }]">
            <router-link 
              v-for="child in item.children" 
              :key="child.path"
              :to="child.path"
              class="submenu-item"
              active-class="active"
            >
              <span class="submenu-text">{{ child.name }}</span>
            </router-link>
          </div>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">
            <span>管</span>
          </div>
          <div class="user-info">
            <span class="user-name">管理员</span>
            <span class="user-role">超级管理员</span>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 17l5-5-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>退出登录</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const expandedMenu = ref('')

const toggleMenu = (path: string) => {
  expandedMenu.value = expandedMenu.value === path ? '' : path
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    router.push('/login')
  }
}

const menuItems = [
  {
    name: '题目管理',
    path: '/app/questions',
    icon: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', class: 'icon-svg' }, [
      h('path', { 
        d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 
        stroke: 'currentColor', 
        'stroke-width': '2', 
        'stroke-linecap': 'round' 
      }),
      h('path', { 
        d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z', 
        stroke: 'currentColor', 
        'stroke-width': '2', 
        'stroke-linecap': 'round' 
      })
    ]),
    children: [
      { name: '模块列表', path: '/app/questions' },
      { name: '批量导入', path: '/app/questions/batch-import' }
    ]
  },
  {
    name: '用户管理',
    path: '/app/users',
    icon: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', class: 'icon-svg' }, [
      h('path', { 
        d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 
        stroke: 'currentColor', 
        'stroke-width': '2', 
        'stroke-linecap': 'round' 
      }),
      h('circle', { cx: '9', cy: '7', r: '4', stroke: 'currentColor', 'stroke-width': '2' }),
      h('path', { 
        d: 'M23 21v-2a4 4 0 0 0-3-3.87', 
        stroke: 'currentColor', 
        'stroke-width': '2', 
        'stroke-linecap': 'round' 
      }),
      h('path', { 
        d: 'M16 3.13a4 4 0 0 1 0 7.75', 
        stroke: 'currentColor', 
        'stroke-width': '2', 
        'stroke-linecap': 'round' 
      })
    ])
  },
  {
    name: '数据分析',
    path: '/app/statistics',
    icon: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', class: 'icon-svg' }, [
      h('path', { 
        d: 'M21 21H3', 
        stroke: 'currentColor', 
        'stroke-width': '2', 
        'stroke-linecap': 'round' 
      }),
      h('path', { 
        d: 'M5 21V9', 
        stroke: 'currentColor', 
        'stroke-width': '2', 
        'stroke-linecap': 'round' 
      }),
      h('path', { 
        d: 'M12 21V5', 
        stroke: 'currentColor', 
        'stroke-width': '2', 
        'stroke-linecap': 'round' 
      }),
      h('path', { 
        d: 'M19 21V12', 
        stroke: 'currentColor', 
        'stroke-width': '2', 
        'stroke-linecap': 'round' 
      })
    ])
  }
]
</script>

<style scoped lang="css">
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  border-right: 1px solid var(--border-light);
  position: relative;
  display: flex;
  flex-direction: column;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, transparent, var(--primary), transparent);
  opacity: 0.3;
}

.sidebar-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 18px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(37, 99, 235, 0.3) transparent;
}

.sidebar-inner::-webkit-scrollbar {
  width: 4px;
}

.sidebar-inner::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-inner::-webkit-scrollbar-thumb {
  background: rgba(37, 99, 235, 0.3);
  border-radius: 2px;
}

.sidebar-inner::-webkit-scrollbar-thumb:hover {
  background: rgba(37, 99, 235, 0.5);
}

.sidebar-header {
  margin-bottom: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 12px rgba(37, 99, 235, 0.3));
}

.logo-text {
  font-family: 'Noto Serif SC', serif;
  font-size: 18px;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 10px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: var(--primary-gradient);
  border-radius: 0 3px 3px 0;
  transition: height 0.3s;
}

.nav-item:hover {
  background: rgba(37, 99, 235, 0.08);
  color: var(--text-primary-color);
}

.nav-item:hover::before {
  height: 50%;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%);
  color: var(--text-primary-color);
  border: 1px solid var(--border-color);
}

.nav-item.active::before {
  height: 60%;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.nav-icon-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-icon {
  width: 45px;
  height: 45px;
  flex-shrink: 0;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  transition: transform 0.3s;
}

.arrow-icon.expanded {
  transform: rotate(180deg);
}

.submenu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding-left: 12px;
}

.submenu.expanded {
  max-height: 100px;
}

.submenu-item {
  display: block;
  padding: 10px 16px 10px 24px;
  margin: 2px 0;
  border-radius: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px;
  transition: all 0.25s;
}

.submenu-item:hover {
  background: rgba(37, 99, 235, 0.08);
  color: var(--text-primary-color);
}

.submenu-item.active {
  background: rgba(37, 99, 235, 0.1);
  color: var(--primary);
  font-weight: 500;
}

.icon-svg {
  width: 45px;
  height: 45px;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  transition: all 0.3s;
  cursor: pointer;
}

.user-profile:hover {
  background: rgba(37, 99, 235, 0.08);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Serif SC', serif;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-role {
  font-size: 11px;
  color: var(--text-muted);
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  margin-top: 8px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--danger);
  color: var(--danger);
}

.logout-btn svg {
  width: 16px;
  height: 16px;
}
</style>
