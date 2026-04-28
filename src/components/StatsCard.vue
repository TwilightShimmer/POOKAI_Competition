<template>
  <article class="stats-card" :style="{ '--accent': color }">
    <div class="sc-top">
      <span class="sc-icon">{{ icon }}</span>
      <span class="sc-dot"></span>
    </div>
    <div class="sc-value">{{ value }}</div>
    <div class="sc-label">{{ label }}</div>
  </article>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '#' },
  value: { type: [String, Number], default: 0 },
  label: { type: String, default: '' },
  color: { type: String, default: 'var(--accent-blue)' }
})
</script>

<style scoped>
.stats-card {
  position: relative;
  overflow: hidden;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid color-mix(in srgb, var(--accent) 18%, rgba(0, 0, 0, 0.06));
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--accent) 8%, white) 0%, rgba(255,255,255,0.94) 100%);
  box-shadow: var(--shadow-sm);
  transition: transform 0.18s ease, box-shadow 0.2s ease, border-color 0.18s ease;
}

.stats-card::after {
  content: '';
  position: absolute;
  inset: auto -10% -45% 20%;
  height: 72px;
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  filter: blur(30px);
  opacity: 0.8;
  pointer-events: none;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: color-mix(in srgb, var(--accent) 26%, rgba(0, 0, 0, 0.08));
}

.sc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.sc-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 10%, white);
}

.sc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent) 12%, transparent);
}

.sc-value {
  position: relative;
  z-index: 1;
  font-size: 1.85rem;
  line-height: 1;
  font-weight: 650;
  letter-spacing: -0.04em;
  color: var(--text);
}

.sc-label {
  position: relative;
  z-index: 1;
  margin-top: 8px;
  color: var(--text-light);
  font-size: 0.82rem;
  font-weight: 600;
}
</style>
