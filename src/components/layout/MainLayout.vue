<template>
  <div class="main-layout">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="page-content">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '../Sidebar.vue'
import Header from '../Header.vue'
</script>

<style scoped lang="css">
.main-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.main-layout::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%);
  pointer-events: none;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  position: relative;
  min-height: 0;
}

.page-content::-webkit-scrollbar {
  width: 8px;
}

.page-content::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
}

.page-content::-webkit-scrollbar-thumb {
  background: rgba(37, 99, 235, 0.3);
  border-radius: 4px;
}

.page-content::-webkit-scrollbar-thumb:hover {
  background: rgba(37, 99, 235, 0.5);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
