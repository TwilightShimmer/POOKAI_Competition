<template>
  <div :class="['bubble', msg.role]">
    <div class="bubble-avatar">{{ msg.role === 'user' ? 'ME' : 'AI' }}</div>
    <div class="bubble-content">
      <span class="bubble-role">{{ msg.role === 'user' ? '你' : 'POOK 助手' }}</span>
      <p>{{ msg.content }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ msg: Object })
</script>

<style scoped>
.bubble {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
  max-width: min(92%, 720px);
}

.bubble.user {
  flex-direction: row-reverse;
  margin-left: auto;
}

.bubble.bot {
  margin-right: auto;
}

.bubble-avatar {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #fff;
  background: #111;
  box-shadow: var(--shadow-sm);
}

.bubble.user .bubble-avatar {
  background: linear-gradient(135deg, #2f7cf6 0%, #111 100%);
}

.bubble-content {
  min-width: 0;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.86);
  box-shadow: var(--shadow-sm);
}

.bubble.user .bubble-content {
  background: linear-gradient(180deg, rgba(17,17,17,0.98) 0%, rgba(40,40,40,0.98) 100%);
  color: #fff;
  border-color: rgba(17,17,17,0.9);
}

.bubble-role {
  display: block;
  margin-bottom: 6px;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: var(--ls-mono);
  color: var(--text-muted);
}

.bubble.user .bubble-role {
  color: rgba(255,255,255,0.56);
}

.bubble-content p {
  margin: 0;
  line-height: 1.72;
  font-size: 0.9rem;
  white-space: pre-wrap;
}
</style>
