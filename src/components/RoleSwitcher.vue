<template>
  <div class="role-switcher">
    <button v-for="r in roles" :key="r.value"
      :class="['role-btn', { active: userStore.currentRole === r.value }]"
      @click="userStore.setRole(r.value)">
      {{ r.icon }} {{ r.label }}
    </button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user.js'
const userStore = useUserStore()
const roles = [
  { value: 'parent', label: '家长', icon: '👨‍👩‍👧' },
  { value: 'student', label: '学生', icon: '🧒' },
  { value: 'org', label: '机构', icon: '🏢' }
]
</script>

<style scoped>
.role-switcher { display: flex; gap: 4px; flex-shrink: 0; }
.role-btn {
  padding: 5px 10px; border-radius: var(--radius-full);
  font-size: 0.75rem; font-weight: 600; color: var(--text-muted);
  background: var(--bg-section); transition: all 0.2s; white-space: nowrap;
}
.role-btn.active { background: var(--primary); color: #fff; }
.role-btn:hover:not(.active) { background: var(--primary-bg); color: var(--primary); }
</style>
