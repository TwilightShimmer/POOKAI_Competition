<template>
  <div class="page report-page">
    <div class="container">
      <section class="report-hero card">
        <div class="hero-main">
          <div>
            <div class="mono-label">Growth Report</div>
            <h1>{{ us.nickname }} 的成长报告</h1>
            <p>{{ us.teamName }} · {{ us.themeData.name }}</p>
          </div>
        </div>
        <div class="hero-rank">超越 {{ mockRank }}%</div>
      </section>

      <section class="report-stats card">
        <div class="rp-stat">
          <span class="rps-val">{{ ks.unlockedCount }}</span>
          <span class="rps-label">知识点</span>
        </div>
        <div class="rp-stat">
          <span class="rps-val">{{ ks.coveredCategories }}</span>
          <span class="rps-label">领域</span>
        </div>
        <div class="rp-stat">
          <span class="rps-val">{{ xps.totalXP }}</span>
          <span class="rps-label">XP</span>
        </div>
        <div class="rp-stat">
          <span class="rps-val">{{ xps.streak }}</span>
          <span class="rps-label">连续天数</span>
        </div>
      </section>

      <section class="card branch-card">
        <div class="mono-label">知识掌握</div>
        <div class="branch-list">
          <div v-for="bp in ks.branchProgress" :key="bp.id" class="branch-row">
            <div class="br-head">
              <div class="br-title">
                <span class="br-name">{{ bp.name }}</span>
              </div>
              <span class="br-pct" :style="{ color: bp.color }">{{ bp.total ? Math.round(bp.unlocked / bp.total * 100) : 0 }}%</span>
            </div>
            <div class="br-bar">
              <div class="br-fill" :style="{ width: (bp.total ? bp.unlocked / bp.total * 100 : 0) + '%', background: bp.color }"></div>
            </div>
            <div class="br-skills">
              <span v-for="child in bp.children.filter((item) => item.unlocked)" :key="child.id" class="br-skill">{{ child.name }}</span>
              <span v-if="!bp.children.filter((item) => item.unlocked).length" class="br-empty">尚未解锁</span>
            </div>
          </div>
        </div>
      </section>

      <section class="share-card card">
        <div class="share-left">
          <strong>分享孩子的成长</strong>
          <span>生成更适合传播的成长海报，把成果从平台内部延展到外部社交场景。</span>
        </div>
        <router-link to="/share" class="btn btn-primary btn-sm">生成海报</router-link>
      </section>

      <div class="report-actions">
        <router-link to="/knowledge" class="btn btn-ghost btn-sm">查看知识树</router-link>
        <router-link to="/bump" class="btn btn-ghost btn-sm">碰一碰</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useKnowledgeStore } from '@/stores/knowledge.js'
import { useUserStore } from '@/stores/user.js'
import { useXPStore } from '@/stores/xp.js'

const us = useUserStore()
const ks = useKnowledgeStore()
const xps = useXPStore()

const mockRank = computed(() => Math.min(99, 60 + Math.min(ks.unlockedCount * 0.8, 30) + (us.nickname.charCodeAt(0) % 8)))
</script>

<style scoped>
.report-page {
  animation: fadeSlideUp 0.32s ease;
}

.report-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.hero-main {
  display: flex;
  align-items: center;
  gap: 14px;
}

.hero-avatar {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(53,53,53,1) 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.report-hero h1 {
  font-size: var(--page-title-size);
  margin: 6px 0 6px;
}

.report-hero p {
  color: var(--text-light);
}

.hero-rank {
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(209,160,51,0.1);
  color: var(--gold-dark);
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
}

.report-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.rp-stat {
  padding: 14px;
  border-radius: 18px;
  background: rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.06);
  text-align: center;
}

.rps-val {
  display: block;
  font-size: 1.6rem;
  font-weight: 650;
}

.rps-label {
  display: block;
  margin-top: 8px;
  color: var(--text-light);
  font-size: 0.8rem;
}

.branch-card {
  margin-bottom: 16px;
}

.branch-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
}

.branch-row {
  padding: 16px;
  border-radius: 18px;
  background: rgba(0,0,0,0.025);
  border: 1px solid rgba(0,0,0,0.05);
}

.br-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.br-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.br-name {
  font-weight: 600;
}

.br-pct {
  font-weight: 700;
}

.br-bar {
  height: 6px;
  background: rgba(0,0,0,0.06);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 10px;
}

.br-fill {
  height: 100%;
  border-radius: 999px;
}

.br-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.br-skill {
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(47,180,108,0.08);
  color: var(--green-dark);
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
}

.br-empty {
  color: var(--text-muted);
  font-size: 0.84rem;
}

.share-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.share-left strong {
  display: block;
  margin-bottom: 4px;
}

.share-left span {
  color: var(--text-light);
  line-height: 1.7;
}

.report-actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 900px) {
  .report-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .share-card,
  .report-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .report-actions {
    flex-direction: column;
  }
}
</style>
