<template>
  <div class="progress-bar">
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: percent+'%' }"></div>
    </div>
    <span v-if="showLabel" class="progress-label">{{ percent }}%</span>
  </div>
</template>
<script setup>
defineProps({ percent: { type: Number, default: 0 }, showLabel: { type: Boolean, default: true } })
</script>
<style scoped>
.progress-bar { display: flex; align-items: center; gap: 10px; }
.progress-track { flex: 1; height: 12px; background: var(--green-light); border-radius: var(--radius-full); overflow: hidden; }
.progress-fill { height: 100%; border-radius: var(--radius-full); transition: width 0.5s ease; min-width: 2px; background: var(--green); position: relative; }
.progress-label { font-size: 0.8rem; font-weight: 800; color: var(--green); min-width: 36px; }
</style>
