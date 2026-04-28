<template>
  <div class="theme-tabs">
    <button v-for="theme in themes" :key="theme.id"
      :class="['theme-tab', { active: modelValue === theme.id }]"
      :style="{ '--tc': theme.color }"
      @click="$emit('update:modelValue', theme.id)">
      <span class="theme-emoji">{{ theme.emoji }}</span>
      <span class="theme-name">{{ theme.name }}</span>
    </button>
  </div>
</template>
<script setup>
import { themes } from '@/mock/themes.js'
defineProps({ modelValue: String })
defineEmits(['update:modelValue'])
</script>
<style scoped>
.theme-tabs { display: flex; gap: 10px; overflow-x: auto; padding: 4px 0; }
.theme-tab {
  display: flex; align-items: center; gap: 8px; padding: 12px 22px;
  border-radius: var(--radius-full); font-weight: 800; font-size: 0.9rem;
  background: var(--bg-card); border: 2px solid var(--border);
  color: var(--text-secondary); transition: all 0.3s; white-space: nowrap;
  box-shadow: var(--shadow-sm);
}
.theme-tab.active {
  border-color: var(--tc); color: var(--tc); background: var(--bg-card);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--tc) 25%, transparent);
  transform: translateY(-2px);
}
.theme-emoji { font-size: 1.3rem; }
</style>
