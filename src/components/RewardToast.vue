<template>
  <Teleport to="body">
    <transition name="toast-pop">
      <div v-if="visible" class="reward-overlay" @click="close">
        <div class="reward-card" @click.stop>
          <div class="confetti">🎊</div>
          <div class="reward-emoji">🎉</div>
          <h3>恭喜完成任务！</h3>
          <div class="reward-items">
            <div class="reward-item" v-if="rewardData.knowledgeCount"><span class="ri-icon">🧠</span><span>获得 {{ rewardData.knowledgeCount }} 个知识点</span></div>
            <div class="reward-item" v-if="rewardData.badge"><span class="ri-icon">🏅</span><span>解锁勋章：{{ rewardData.badge }}</span></div>
            <div class="reward-item" v-if="rewardData.examReady"><span class="ri-icon">🚀</span><span>已具备参加等级考试条件！</span></div>
          </div>
          <button class="btn btn-gold" @click="close">太棒了！</button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
<script setup>
import { ref, reactive, provide } from 'vue'
const visible = ref(false)
const rewardData = reactive({ knowledgeCount: 0, badge: '', examReady: false })
function show(data) { Object.assign(rewardData, data); visible.value = true }
function close() { visible.value = false }
provide('rewardToast', { show }); defineExpose({ show, close })
</script>
<style scoped>
.reward-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.35); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.reward-card { background: #fff; border-radius: var(--radius-xl); padding: 36px; text-align: center; max-width: 380px; width: 100%; box-shadow: 0 16px 60px rgba(123,97,255,0.2); position: relative; overflow: hidden; border: 2px solid rgba(255,215,0,0.3); }
.confetti { position: absolute; top: 8px; right: 12px; font-size: 2rem; animation: spin 2s linear infinite; }
@keyframes spin { to{transform:rotate(360deg)} }
.reward-emoji { font-size: 3.5rem; margin-bottom: 12px; }
.reward-card h3 { font-size: 1.3rem; font-weight: 900; margin-bottom: 18px; color: var(--text-primary); }
.reward-items { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
.reward-item { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #FFFBEB; border: 1.5px solid rgba(255,215,0,0.2); border-radius: var(--radius-md); font-weight: 700; font-size: 0.9rem; }
.ri-icon { font-size: 1.4rem; }
.toast-pop-enter-active { animation: popIn 0.3s ease; }
.toast-pop-leave-active { animation: popIn 0.2s ease reverse; }
@keyframes popIn { from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)} }
</style>
