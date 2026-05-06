<template>
  <div class="main-layout">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="page-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
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
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  position: relative;
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
  overflow: hidden;
  position: relative;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  position: relative;
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
