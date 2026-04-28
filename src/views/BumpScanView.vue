<template>
  <div class="page scan-page">
    <div class="container" style="max-width: 760px;">
      <section v-if="phase === 'scan'" class="card stage-card">
        <div class="mono-label">Scan Mode</div>
        <h1>扫描伙伴二维码</h1>

        <div class="camera-box">
          <div class="camera-frame">
            <div class="scan-line"></div>
            <div class="corner tl"></div>
            <div class="corner tr"></div>
            <div class="corner bl"></div>
            <div class="corner br"></div>
          </div>
          <p class="camera-label">摄像头区域</p>
        </div>

        <div class="stage-actions">
          <button class="btn btn-primary btn-lg" @click="simulateScan">模拟扫码成功</button>
          <router-link to="/bump" class="btn btn-ghost btn-lg">返回</router-link>
        </div>
      </section>

      <section v-if="phase === 'matching'" class="card stage-card matching-card">
        <div class="match-anim">
          <div class="ma-me">
            <div class="ma-avatar">{{ us.nickname.slice(0, 1) }}</div>
            <span>{{ us.nickname }}</span>
          </div>
          <div class="ma-spark">
            <div class="spark-ring"></div>
            <span class="spark-icon">↔</span>
          </div>
          <div class="ma-them">
            <div class="ma-avatar them">{{ partner.name.slice(0, 1) }}</div>
            <span>{{ partner.name }}</span>
          </div>
        </div>
        <p class="match-text">正在完成匹配与交换...</p>
      </section>

      <section v-if="phase === 'result'" class="card stage-card">
        <div class="mono-label">Exchange Result</div>
        <h1>碰一碰成功</h1>

        <div class="rc-exchange">
          <div class="rc-side">
            <div class="rc-avatar">{{ us.nickname.slice(0, 1) }}</div>
            <span class="rc-name">{{ us.nickname }}</span>
            <span class="rc-group">获得题组 {{ result.myGot }}</span>
          </div>
          <div class="rc-swap">⇄</div>
          <div class="rc-side">
            <div class="rc-avatar them">{{ partner.name.slice(0, 1) }}</div>
            <span class="rc-name">{{ partner.name }}</span>
            <span class="rc-group">获得题组 {{ result.theirGot }}</span>
          </div>
        </div>

        <div class="rc-detail">
          <p>你获得了 <strong>{{ partner.name }}</strong> 的题组 {{ result.myGot }}。</p>
          <p>{{ partner.name }} 获得了你的题组 {{ result.theirGot }}。</p>
        </div>

        <div class="stage-actions">
          <router-link to="/tasks" class="btn btn-primary btn-lg">去做新题目</router-link>
          <router-link to="/bump" class="btn btn-ghost btn-lg">继续碰一碰</router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useKnowledgeStore } from '@/stores/knowledge.js'
import { useUserStore } from '@/stores/user.js'

const us = useUserStore()
const ks = useKnowledgeStore()

const phase = ref('scan')
const partner = ref({ name: '小月亮', group: '3' })
const result = ref({ myGot: '', theirGot: '' })

const mockPartners = [
  { name: '小星星', group: '2' },
  { name: '小月亮', group: '3' },
  { name: '小火箭', group: '4' },
  { name: '小卫星', group: '5' },
  { name: '小陨石', group: '6' },
]

function simulateScan() {
  const selected = mockPartners[Math.floor(Math.random() * mockPartners.length)]
  partner.value = selected
  phase.value = 'matching'

  setTimeout(() => {
    const myGroups = JSON.parse(localStorage.getItem('pook_my_groups') || '["1"]')
    const myShareGroup = myGroups[Math.floor(Math.random() * myGroups.length)]

    if (!myGroups.includes(selected.group)) {
      myGroups.push(selected.group)
      localStorage.setItem('pook_my_groups', JSON.stringify(myGroups))
    }

    result.value = { myGot: selected.group, theirGot: myShareGroup }

    const history = JSON.parse(localStorage.getItem('pook_bump_history') || '[]')
    history.unshift({
      partnerName: selected.name,
      myGot: selected.group,
      theirGot: myShareGroup,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    })
    localStorage.setItem('pook_bump_history', JSON.stringify(history.slice(0, 20)))

    ks.randomUnlockNodes()
    phase.value = 'result'
  }, 1800)
}
</script>

<style scoped>
.scan-page {
  animation: fadeSlideUp 0.32s ease;
}

.stage-card {
  text-align: center;
}

.stage-card h1 {
  font-size: var(--page-title-size);
  margin: 12px 0 10px;
}

.stage-desc,
.camera-label,
.match-text,
.rc-detail {
  color: var(--text-light);
}

.camera-box {
  margin: 24px 0;
}

.camera-frame {
  width: 300px;
  height: 300px;
  margin: 0 auto 12px;
  position: relative;
  background: rgba(0,0,0,0.05);
  border-radius: 28px;
  overflow: hidden;
}

.scan-line {
  position: absolute;
  left: 10%;
  width: 80%;
  height: 2px;
  background: var(--green);
  animation: scanMove 2s ease-in-out infinite;
}

@keyframes scanMove {
  0%,100% { top: 12%; }
  50% { top: 84%; }
}

.corner {
  position: absolute;
  width: 28px;
  height: 28px;
  border-color: var(--green);
  border-style: solid;
  border-width: 0;
}

.tl { top: 12px; left: 12px; border-top-width: 3px; border-left-width: 3px; }
.tr { top: 12px; right: 12px; border-top-width: 3px; border-right-width: 3px; }
.bl { bottom: 12px; left: 12px; border-bottom-width: 3px; border-left-width: 3px; }
.br { bottom: 12px; right: 12px; border-bottom-width: 3px; border-right-width: 3px; }

.stage-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.match-anim {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 28px 0 18px;
}

.ma-avatar,
.rc-avatar {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: #111111;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  font-size: 1.45rem;
  font-weight: 700;
}

.ma-avatar.them,
.rc-avatar.them {
  background: var(--orange);
}

.spark-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 3px solid rgba(17,17,17,0.12);
  animation: sparkPulse 1s ease-in-out infinite;
}

.spark-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.4rem;
}

.ma-spark {
  position: relative;
}

@keyframes sparkPulse {
  0%,100% { transform: scale(0.88); opacity: 0.4; }
  50% { transform: scale(1.08); opacity: 0.9; }
}

.rc-exchange {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin: 24px 0;
}

.rc-side {
  text-align: center;
}

.rc-name {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
}

.rc-group {
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(0,0,0,0.04);
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
}

.rc-swap {
  font-size: 1.6rem;
  color: var(--text-light);
}

.rc-detail {
  margin-bottom: 18px;
  line-height: 1.8;
}

@media (max-width: 640px) {
  .camera-frame {
    width: 100%;
    max-width: 300px;
    height: 280px;
  }

  .rc-exchange,
  .match-anim {
    flex-direction: column;
  }
}
</style>
