<template>
  <div class="page kn-page">
    <div class="container">
      <section class="kn-hero card">
        <div>
          <div class="sbadge">Knowledge Workspace</div>
          <h1>知识树概览</h1>
          <p>可视化展示你的学习进度</p>
        </div>
        <div class="kn-hero-stats">
          <div class="kn-stat">
            <span class="ks-val">{{ ks.unlockedCount }}<small>/{{ ks.totalChildren }}</small></span>
            <span class="ks-lbl">知识点</span>
          </div>
          <div class="kn-stat">
            <span class="ks-val">{{ ks.coveredCategories }}<small>/5</small></span>
            <span class="ks-lbl">领域</span>
          </div>
          <div class="kn-stat">
            <span class="ks-val">{{ progressPct }}<small>%</small></span>
            <span class="ks-lbl">进度</span>
          </div>
        </div>
      </section>

      <section class="card branch-card">
        <div class="sec-row">
          <span class="mono-label">知识领域</span>
        </div>

          <div class="branch-list">
          <div v-for="(bp, index) in ks.branchProgress" :key="bp.id" class="branch-row">
            <div class="br-head">
              <div class="br-title">
                <div>
                  <strong>{{ bp.name }}</strong>
                  <span>{{ bp.unlocked }}/{{ bp.total }} 知识点</span>
                </div>
              </div>
              <span class="br-pct" :style="{ color: branchColors[index] }">{{ bp.total ? Math.round(bp.unlocked / bp.total * 100) : 0 }}%</span>
            </div>
            <div class="br-bar">
              <div class="br-fill" :style="{ width: (bp.total ? Math.round(bp.unlocked / bp.total * 100) : 0) + '%', background: branchColors[index] }"></div>
            </div>
          </div>
        </div>
      </section>

      <div class="entry-grid">
        <router-link to="/knowledge/tree" class="graph-entry card">
          <div class="ge-info">
            <strong>打开知识图谱</strong>
            <span>进入全屏图谱视图，缩放、拖拽并查看节点关联。</span>
          </div>
          <span class="ge-arrow">→</span>
        </router-link>
      </div>

      <div class="kn-actions">
        <router-link to="/bump" class="btn btn-purple btn-sm">碰一碰获取新节点</router-link>
        <button class="btn btn-ghost btn-sm" @click="handleReset">重置进度</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useKnowledgeStore } from '@/stores/knowledge.js'

const ks = useKnowledgeStore()
const branchColors = ['#d1a033', '#2383e2', '#2fb46c', '#7c5cff', '#e5484d']
const progressPct = computed(() => ks.totalChildren ? Math.round(ks.unlockedCount / ks.totalChildren * 100) : 0)

function handleReset() {
  if (confirm('确定重置知识树进度？')) ks.resetProgress()
}
</script>

<style scoped>
.kn-page {
  animation: fadeSlideUp 0.32s ease;
}

.kn-hero {
  display: grid;
  grid-template-columns: 1.15fr 0.95fr;
  gap: 20px;
  margin-bottom: 18px;
}

.kn-hero h1 {
  font-size: var(--page-title-size);
  margin: 12px 0 10px;
}

.kn-hero p {
  color: var(--text-light);
  line-height: 1.75;
}

.kn-hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.kn-stat {
  padding: 18px;
  border-radius: 18px;
  background: rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.06);
  text-align: center;
}

.ks-val {
  display: block;
  font-size: 1.8rem;
  font-weight: 650;
  line-height: 1;
}

.ks-val small {
  margin-left: 4px;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--text-muted);
}

.ks-lbl {
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
  gap: 10px;
}

.br-title strong {
  display: block;
  font-size: 0.96rem;
  margin-bottom: 2px;
}

.br-title span {
  color: var(--text-light);
  font-size: 0.82rem;
}

.br-emoji {
  font-size: 1.2rem;
}

.br-pct {
  font-size: 0.96rem;
  font-weight: 700;
}

.br-bar {
  height: 6px;
  background: rgba(0,0,0,0.06);
  border-radius: 999px;
  overflow: hidden;
}

.br-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s ease;
}

.entry-grid {
  display: grid;
  gap: 12px;
  margin-bottom: 14px;
}

.graph-entry {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
}

.ge-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(53,53,53,1) 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.ge-info {
  flex: 1;
}

.ge-info strong {
  display: block;
  color: var(--text);
  margin-bottom: 4px;
}

.ge-info span,
.ge-arrow {
  color: var(--text-light);
}

.kn-actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 900px) {
  .kn-hero,
  .kn-hero-stats {
    grid-template-columns: 1fr;
  }

  .kn-actions {
    flex-direction: column;
  }
}
</style>
