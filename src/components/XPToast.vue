<template>
  <div v-if="store.show" class="xp-overlay">
    <div class="xp-pop">+{{ store.amount }} XP</div>
  </div>
</template>

<script setup>
import { useXPStore } from '@/stores/xp.js'
const store = useXPStore()
</script>

<style scoped>
.xp-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: none;
}

.xp-pop {
  min-height: 64px;
  padding: 0 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #111;
  background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,243,224,0.98) 100%);
  border: 1px solid rgba(209,160,51,0.24);
  box-shadow: 0 22px 50px rgba(0,0,0,0.14);
  animation: xpPop 1.5s ease-out forwards;
}
</style>
