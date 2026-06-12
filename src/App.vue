<template>
  <div id="app-root">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 全局错误处理
window.onerror = function(message, source, lineno, colno, error) {
  console.error('全局错误:', message, source, lineno, colno, error)
  return true
}

window.addEventListener('unhandledrejection', function(event) {
  console.error('未处理的Promise拒绝:', event.reason)
})
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
