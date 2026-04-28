<template>
  <div class="avatar-wrap">
    <div class="avatar-shell">
      <div class="avatar-core">
        <div class="core-line top"></div>
        <div class="core-line mid"></div>
        <div class="core-line bottom"></div>
      </div>
      <div class="avatar-orbit"></div>
    </div>
    <div class="avatar-name">POOK 助手</div>
  </div>
</template>

<style scoped>
.avatar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.avatar-shell {
  position: relative;
  width: 92px;
  height: 92px;
  border-radius: 28px;
  background: linear-gradient(145deg, #111111 0%, #2b2b2b 100%);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-shell::before {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: 27px;
  border: 1px solid rgba(255,255,255,0.08);
}

.avatar-core {
  position: relative;
  z-index: 1;
  width: 40px;
  display: grid;
  gap: 7px;
}

.core-line {
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.32) 100%);
  animation: pulse 2.4s ease-in-out infinite;
}

.core-line.mid {
  width: 32px;
  animation-delay: 0.2s;
}

.core-line.bottom {
  width: 24px;
  animation-delay: 0.4s;
}

.avatar-orbit {
  position: absolute;
  inset: 18px;
  border-radius: 22px;
  border: 1px dashed rgba(255,255,255,0.18);
  animation: rotate 10s linear infinite;
}

.avatar-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-light);
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scaleX(0.9); }
  50% { opacity: 1; transform: scaleX(1); }
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}
</style>
