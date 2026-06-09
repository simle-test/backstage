<template>
  <router-view v-slot="{ Component }">
    <div v-if="error" class="error-fallback">
      <h2>组件加载失败</h2>
      <p>{{ error.message }}</p>
      <button @click="reloadPage">重新加载</button>
    </div>
    <Suspense v-else>
      <component :is="Component" />
      <template #fallback>
        <div class="loading-fallback">加载中...</div>
      </template>
    </Suspense>
  </router-view>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  console.error('组件渲染错误:', err)
  error.value = err
  return false // 阻止错误继续向上传播
})

const reloadPage = () => {
  error.value = null
  window.location.reload()
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  width: 100%;
  height: 100%;
}
</style>