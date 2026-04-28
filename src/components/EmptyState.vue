<template>
  <div class="empty-state">
    <div class="empty-icon">{{ icon }}</div>
    <div class="empty-text">{{ text }}</div>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '·' },
  text: { type: String, default: '暂无内容' }
})
</script>

<style scoped>
.empty-state {
  padding: 48px 20px;
  border-radius: 24px;
  border: 1px dashed rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.56);
  text-align: center;
}

.empty-icon {
  width: 58px;
  height: 58px;
  margin: 0 auto 14px;
  border-radius: 18px;
  background: rgba(0,0,0,0.05);
  color: var(--text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  line-height: 1;
}

.empty-text {
  font-size: 0.94rem;
  color: var(--text-light);
  font-weight: 600;
  margin-bottom: 14px;
}
</style>
