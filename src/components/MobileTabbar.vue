<template>
  <nav class="tab-bar">
    <router-link v-for="item in tabs" :key="item.path" :to="item.path" :class="['tab', { active: isActive(item.path) }]">
      <span class="tab-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

const route = useRoute()
const userStore = useUserStore()

const tabs = computed(() => {
  if (userStore.currentRole === 'platform') {
    return [
      { path: '/platform', label: '运营' },
      { path: '/', label: '首页' },
    ]
  }

  if (userStore.currentRole === 'org') {
    return [
      { path: '/org', label: '机构' },
      { path: '/', label: '首页' },
    ]
  }

  return [
    { path: '/tasks', label: '任务' },
    { path: '/knowledge', label: '知识' },
    { path: '/report', label: '报告' },
    { path: '/student', label: '个人中心' },
  ]
})

function isActive(path) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped>
.tab-bar {
  position: fixed;
  left: 14px;
  right: 14px;
  bottom: 14px;
  z-index: 100;
  height: var(--tabbar-h);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 24px;
  background: rgba(255,255,255,0.86);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 56px;
  padding: 8px 4px;
  border-radius: 18px;
  text-decoration: none;
  transition: background 0.14s, opacity 0.14s, transform 0.14s;
  opacity: 0.52;
  min-width: 0;
}

.tab.active {
  opacity: 1;
  background: #111111;
}

.tab:not(.active):hover {
  opacity: 0.8;
  background: rgba(0,0,0,0.04);
}

.tab-label {
  font-size: 10px;
  font-weight: 540;
  letter-spacing: -0.08px;
  color: var(--text-light);
  white-space: nowrap;
}

.tab.active .tab-label {
  color: #ffffff;
  font-weight: 600;
}

@media (min-width: 900px) {
  .tab-bar {
    top: calc(var(--header-h) + 20px);
    left: 18px;
    right: auto;
    bottom: 18px;
    width: var(--sidebar-w);
    height: auto;
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
    gap: 4px;
    overflow-y: auto;
    border-radius: 24px;
    background: rgba(255,255,255,0.78);
  }

  .tab {
    flex: none;
    flex-direction: row;
    justify-content: flex-start;
    gap: 0;
    min-height: 42px;
    padding: 0 12px;
    border-radius: 16px;
    opacity: 1;
  }

  .tab:not(.active):hover {
    background: rgba(0,0,0,0.04);
    opacity: 1;
  }

  .tab.active {
    background: #111111;
  }

  .tab-label {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: -0.1px;
    color: var(--text-light);
  }

  .tab.active .tab-label {
    color: #ffffff;
    font-weight: 600;
  }
}
</style>
