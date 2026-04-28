<template>
  <div class="page share-page">
    <div class="container share-shell">
      <section class="share-copy">
        <div class="sbadge">Share Poster</div>
        <h1>分享学习成果</h1>
        <p>预览你的成长海报，一键分享给家人和朋友，把这段学习成果好好记录下来。</p>
      </section>

      <section class="share-main">
        <div class="poster-wrap">
          <div class="poster" ref="posterRef">
            <div class="p-header">
              <div class="p-logo">POOK AI</div>
              <div class="p-season">2026 · 月球行动</div>
            </div>

            <div class="p-child">
              <div class="p-avatar">{{ us.nickname.slice(0, 1) }}</div>
              <div class="p-child-info">
                <h2>{{ us.nickname }}</h2>
                <p>{{ us.teamName }} · {{ us.themeData.name }}</p>
              </div>
            </div>

            <div class="p-achievement">
              <div class="p-big-num">{{ ks.unlockedCount }}</div>
              <div class="p-big-label">个知识点已点亮</div>
              <div class="p-rank">超越 <span>{{ mockRank }}%</span> 的同龄小朋友</div>
            </div>

            <div class="p-knowledge">
              <div class="p-kn-title">知识领域掌握</div>
              <div class="p-kn-list">
                <div v-for="branch in topBranches" :key="branch.id" class="p-kn-item">
                  <span class="pkn-emoji">{{ branch.emoji }}</span>
                  <span class="pkn-name">{{ branch.name }}</span>
                  <div class="pkn-bar"><div class="pkn-fill" :style="{ width: branch.pct + '%', background: branch.color }"></div></div>
                  <span class="pkn-pct">{{ branch.pct }}%</span>
                </div>
              </div>
            </div>

            <div class="p-stats">
              <div class="p-stat"><span class="ps-v">{{ ks.unlockedCount }}/{{ ks.totalChildren }}</span><span class="ps-l">知识点</span></div>
              <div class="p-stat"><span class="ps-v">{{ ks.coveredCategories }}/5</span><span class="ps-l">领域</span></div>
              <div class="p-stat"><span class="ps-v">{{ ks.level }}</span><span class="ps-l">等级</span></div>
            </div>

            <div v-if="masteredSkills.length" class="p-skills">
              <div class="p-skills-title">已掌握技能</div>
              <div class="p-skills-list">
                <span v-for="skill in masteredSkills.slice(0, 6)" :key="skill" class="p-skill">{{ skill }}</span>
              </div>
            </div>

            <div class="p-footer">
              <div class="p-qr">
                <div class="p-qr-box">
                  <svg viewBox="0 0 100 100" width="72" height="72">
                    <rect width="100" height="100" rx="10" fill="#fff"/>
                    <rect v-for="(block, index) in miniQR" :key="index" :x="block.x" :y="block.y" width="8" height="8" fill="#111" rx="1"/>
                    <circle cx="50" cy="50" r="12" fill="#fff" stroke="#111" stroke-width="1.5"/>
                    <text x="50" y="54" text-anchor="middle" fill="#111" font-size="8" font-weight="900">P</text>
                  </svg>
                </div>
                <span class="p-qr-hint">扫码加入挑战</span>
              </div>
              <div class="p-cta">
                <div class="p-cta-text">一起加入 POOK 训练平台</div>
                <div class="p-cta-sub">更清晰的成长反馈，更长线的学习陪伴。</div>
              </div>
            </div>
          </div>
        </div>

        <div class="share-actions">
          <button class="btn btn-primary btn-lg" @click="mockShare('朋友圈')">分享到朋友圈</button>
          <button class="btn btn-ghost btn-lg" @click="mockShare('微信好友')">发给好友</button>
          <button class="btn btn-ghost btn-lg" @click="mockSave">保存到相册</button>
        </div>

        <div class="share-tips card">
          <div class="mono-label">分享提示</div>
          <ul>
            <li>长按海报可保存到手机相册。</li>
            <li>分享时可以配上一句自己的学习收获或挑战心得。</li>
            <li>邀请朋友扫码了解赛事主题，一起加入探索挑战。</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useKnowledgeStore } from '@/stores/knowledge.js'
import { useUserStore } from '@/stores/user.js'

const us = useUserStore()
const ks = useKnowledgeStore()
const posterRef = ref(null)

const mockRank = computed(() => {
  const base = 60 + Math.min(ks.unlockedCount * 0.8, 30)
  return Math.min(99, Math.round(base + (us.nickname.charCodeAt(0) % 8)))
})

const topBranches = computed(() =>
  ks.branchProgress.map((branch) => ({
    ...branch,
    pct: branch.total ? Math.round(branch.unlocked / branch.total * 100) : 0,
  }))
)

const masteredSkills = computed(() => {
  const skills = []
  ks.branchProgress.forEach((branch) => {
    branch.children.forEach((child) => {
      if (child.unlocked) skills.push(child.name)
    })
  })
  return skills
})

const miniQR = (() => {
  const blocks = []
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (Math.random() > 0.4 && !(row > 2 && row < 6 && col > 2 && col < 6)) {
        blocks.push({ x: 10 + col * 10, y: 10 + row * 10 })
      }
    }
  }
  return blocks
})()

function mockShare(target) {
  alert(`已分享到${target}\n\n小程序版本可接入真实分享能力。`)
}

function mockSave() {
  alert('已保存到相册\n\n小程序版本可接入 Canvas 导出。')
}
</script>

<style scoped>
.share-page {
  animation: fadeSlideUp 0.32s ease;
}

.share-shell {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.share-copy {
  padding-top: 8px;
}

.share-copy h1 {
  font-size: var(--page-title-size);
  margin: 14px 0 12px;
}

.share-copy p {
  color: var(--text-light);
  line-height: 1.8;
}

.poster-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
}

.poster {
  width: 380px;
  padding: 24px 22px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(70,210,111,0.12) 0%, transparent 28%),
    radial-gradient(circle at 82% 14%, rgba(146,96,255,0.12) 0%, transparent 24%),
    linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,247,243,1) 100%);
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: var(--shadow-lg);
}

.p-header,
.p-child,
.p-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.p-header {
  margin-bottom: 18px;
}

.p-logo {
  font-weight: 700;
  letter-spacing: 0.08em;
}

.p-season {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: var(--ls-mono);
}

.p-child {
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 18px;
}

.p-avatar {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: #111111;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.45rem;
  font-weight: 700;
}

.p-child-info h2 {
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.p-child-info p {
  color: var(--text-light);
}

.p-achievement {
  text-align: center;
  padding: 24px 18px;
  border-radius: 22px;
  background: rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.06);
  margin-bottom: 18px;
}

.p-big-num {
  font-size: 3.6rem;
  font-weight: 700;
  line-height: 1;
}

.p-big-label,
.p-rank {
  color: var(--text-light);
  margin-top: 8px;
}

.p-rank span {
  color: var(--text);
  font-weight: 700;
}

.p-knowledge {
  margin-bottom: 18px;
}

.p-kn-title,
.p-skills-title {
  margin-bottom: 10px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: var(--ls-mono);
  color: var(--text-muted);
}

.p-kn-list {
  display: grid;
  gap: 8px;
}

.p-kn-item {
  display: grid;
  grid-template-columns: 24px 62px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
}

.pkn-name,
.pkn-pct {
  font-size: 0.78rem;
  color: var(--text-light);
}

.pkn-bar {
  height: 6px;
  background: rgba(0,0,0,0.06);
  border-radius: 999px;
  overflow: hidden;
}

.pkn-fill {
  height: 100%;
  border-radius: 999px;
}

.p-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 18px;
}

.p-stat {
  padding: 12px;
  border-radius: 18px;
  background: rgba(0,0,0,0.03);
  text-align: center;
}

.ps-v {
  display: block;
  font-weight: 700;
}

.ps-l {
  display: block;
  margin-top: 4px;
  color: var(--text-light);
  font-size: 0.74rem;
}

.p-skills {
  margin-bottom: 18px;
}

.p-skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.p-skill {
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(0,0,0,0.04);
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-light);
}

.p-footer {
  gap: 16px;
  align-items: flex-start;
  padding-top: 18px;
  border-top: 1px solid rgba(0,0,0,0.08);
}

.p-qr {
  text-align: center;
}

.p-qr-box {
  padding: 4px;
  border-radius: 16px;
  background: #fff;
  box-shadow: var(--shadow-sm);
}

.p-qr-hint,
.p-cta-sub {
  color: var(--text-light);
  font-size: 0.74rem;
}

.p-cta-text {
  font-weight: 700;
  margin-bottom: 6px;
}

.share-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.share-tips ul {
  margin-top: 12px;
  padding-left: 18px;
  color: var(--text-light);
  line-height: 1.75;
}

@media (max-width: 980px) {
  .share-shell {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .poster {
    width: 100%;
  }

  .share-actions {
    flex-direction: column;
  }
}
</style>
