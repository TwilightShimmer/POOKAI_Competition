<template>
  <div class="page tasks-page">
    <div class="container">
      <section class="tasks-hero card">
        <div class="hero-copy">
          <div class="sbadge">Mission Workspace</div>
          <h1>{{ us.currentThemeName || '赛事主题' }}任务台</h1>
          <p>用更清晰的任务编排、线性的状态反馈和更低噪音的界面，把学习过程做成像真正的训练工作台。</p>
        </div>

        <div class="hero-grid">
          <div class="hero-metric">
            <span class="metric-label">当前战队</span>
            <strong>{{ us.teamName || '未加入战队' }}</strong>
            <small>{{ us.themeData.name }}</small>
          </div>
          <div class="hero-metric">
            <span class="metric-label">完成进度</span>
            <strong>{{ progressPct }}%</strong>
            <small>{{ doneCount }} / {{ tasks.length }} 已完成</small>
          </div>
          <div class="hero-metric">
            <span class="metric-label">累计 XP</span>
            <strong>{{ xps.totalXP }}</strong>
            <small>{{ ks.unlockedCount }} 个知识点点亮</small>
          </div>
        </div>
      </section>

      <section class="tasks-shell">
        <aside class="task-rail card">
          <div class="rail-head">
            <div>
              <div class="mono-label">任务序列</div>
              <h2>全部任务</h2>
            </div>
            <span class="rail-counter">{{ doneCount }}/{{ tasks.length }}</span>
          </div>

          <div class="rail-progress">
            <div class="glow-bar">
              <div class="glow-fill" :style="{ width: progressPct + '%' }"></div>
            </div>
          </div>

          <div class="task-list">
            <button
              v-for="task in tasks"
              :key="task.id"
              type="button"
              :class="['task-row', task.status, { selected: activeTaskId === task.id }]"
              @click="activeTaskId = task.id"
            >
              <div class="task-row-icon">
                <span v-if="task.status === 'done'">✓</span>
                <span v-else-if="task.status === 'locked'">·</span>
                <span v-else>{{ task.id }}</span>
              </div>

              <div class="task-row-main">
                <div class="task-row-top">
                  <strong>{{ task.id }}</strong>
                  <span class="task-row-status">{{ statusText(task.status) }}</span>
                </div>
                <div class="task-row-title">{{ task.name }}</div>
                <p>{{ task.summary }}</p>
              </div>

              <div class="task-row-side">
                <span>{{ task.maxScore }}</span>
                <small>XP</small>
              </div>
            </button>
          </div>
        </aside>

        <section v-if="selectedTask" class="task-panel card">
          <div class="panel-top">
            <div class="panel-badge" :class="selectedTask.status">
              <span class="panel-badge-icon">{{ selectedTask.status === 'done' ? '✓' : selectedTask.id }}</span>
              <span>{{ statusText(selectedTask.status) }}</span>
            </div>
            <div class="panel-points">{{ selectedTask.maxScore }} XP</div>
          </div>

          <div class="panel-title">
            <div class="panel-title-mark">{{ selectedTask.id }}</div>
            <div>
              <div class="mono-label">{{ selectedTask.id }}</div>
              <h2>{{ selectedTask.name }}</h2>
              <p>{{ selectedTask.summary }}</p>
            </div>
          </div>

          <div class="panel-grid">
            <div class="panel-block">
              <div class="block-label">任务说明</div>
              <p class="block-copy">{{ selectedTask.description }}</p>
            </div>
            <div class="panel-block">
              <div class="block-label">难度等级</div>
              <div class="difficulty-row">
                <span v-for="n in selectedTask.difficulty" :key="n" class="difficulty-dot"></span>
                <span class="difficulty-text">Level {{ selectedTask.difficulty }}</span>
              </div>
            </div>
          </div>

          <div class="panel-block">
            <div class="block-label">得分规则</div>
            <div class="score-list">
              <div v-for="(score, index) in selectedTask.scoring" :key="index" class="score-row">
                <span class="score-points">+{{ score.points }}</span>
                <span class="score-text">{{ score.condition }}</span>
              </div>
            </div>
          </div>

          <div class="panel-block">
            <div class="block-label">核心能力</div>
            <div class="skill-list">
              <span v-for="skill in selectedTask.skills" :key="skill" class="skill-chip">{{ skill }}</span>
            </div>
          </div>

          <div class="panel-actions">
            <button
              v-if="selectedTask.status === 'current' || selectedTask.status === 'done'"
              class="btn btn-primary btn-lg"
              @click="router.push('/tasks/' + selectedTask.id + '/learn')"
            >
              {{ selectedTask.status === 'done' ? '再次学习' : '进入学习页面' }}
            </button>

            <button v-else class="btn btn-ghost btn-lg" disabled>
              完成前置任务后解锁
            </button>

            <router-link to="/assistant" class="btn btn-blue">问 AI 助教</router-link>
            <router-link to="/knowledge" class="btn btn-purple">查看知识树</router-link>
            <router-link to="/report" class="btn btn-gold">成长报告</router-link>
          </div>
        </section>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import { useXPStore } from '@/stores/xp.js'
import { useKnowledgeStore } from '@/stores/knowledge.js'
import { getThemeMissionTasks } from '@/mock/themeMissionTasks.js'

const router = useRouter()
const us = useUserStore()
const xps = useXPStore()
const ks = useKnowledgeStore()
const completedIds = ref(JSON.parse(localStorage.getItem('pook_task_done') || '[]'))
const themeTasks = computed(() => getThemeMissionTasks(us.currentTheme))

const tasks = computed(() => {
  let foundCurrent = false
  return themeTasks.value.map((task) => {
    if (completedIds.value.includes(task.id)) return { ...task, status: 'done' }
    if (!foundCurrent) {
      foundCurrent = true
      return { ...task, status: 'current' }
    }
    return { ...task, status: 'locked' }
  })
})

const currentTask = computed(() => tasks.value.find((task) => task.status === 'current') || tasks.value[0] || null)
const activeTaskId = ref(currentTask.value?.id || themeTasks.value[0]?.id || '')
const selectedTask = computed(() => tasks.value.find((task) => task.id === activeTaskId.value) || currentTask.value)
const doneCount = computed(() => tasks.value.filter((task) => task.status === 'done').length)
const progressPct = computed(() => (tasks.value.length ? Math.round((doneCount.value / tasks.value.length) * 100) : 0))

function statusText(status) {
  return {
    done: '已完成',
    current: '进行中',
    locked: '未解锁',
  }[status] || '待开始'
}

function focusCurrent() {
  if (currentTask.value) activeTaskId.value = currentTask.value.id
}
</script>

<style scoped>
.tasks-page {
  animation: fadeSlideUp 0.32s ease;
}

.tasks-hero {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  overflow: hidden;
}

.hero-copy {
  position: relative;
  z-index: 1;
}

.hero-copy h1 {
  font-size: var(--page-title-size);
  margin: 10px 0 12px;
}

.hero-copy p {
  max-width: 620px;
  color: var(--text-light);
  font-size: 0.98rem;
  line-height: 1.75;
}

.hero-grid {
  display: grid;
  gap: 12px;
}

.hero-metric {
  padding: 18px;
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(250,250,247,0.96) 100%);
  border: 1px solid rgba(0,0,0,0.08);
}

.metric-label {
  display: block;
  margin-bottom: 8px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: var(--ls-mono);
  color: var(--text-muted);
}

.hero-metric strong {
  display: block;
  font-size: 1.45rem;
  font-weight: 620;
  letter-spacing: -0.03em;
}

.hero-metric small {
  display: block;
  margin-top: 4px;
  color: var(--text-light);
}

.tasks-shell {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.task-rail {
  position: sticky;
  top: calc(var(--header-h) + 28px);
}

.rail-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.rail-head h2 {
  font-size: 1.2rem;
}

.rail-counter {
  min-width: 56px;
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(0,0,0,0.04);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-light);
}

.rail-progress {
  margin-bottom: 16px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-row {
  width: 100%;
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 18px;
  background: rgba(255,255,255,0.56);
  cursor: pointer;
  text-align: left;
  transition: transform 0.14s ease, border-color 0.14s ease, box-shadow 0.18s ease, background 0.14s ease;
}

.task-row:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.task-row.selected {
  border-color: rgba(0,0,0,0.18);
  background: rgba(255,255,255,0.92);
}

.task-row.locked {
  opacity: 0.66;
}

.task-row.done {
  background: linear-gradient(180deg, rgba(47,180,108,0.08) 0%, rgba(255,255,255,0.92) 100%);
}

.task-row.current {
  background: linear-gradient(180deg, rgba(146,96,255,0.06) 0%, rgba(255,255,255,0.96) 100%);
}

.task-row-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
}

.task-row.done .task-row-icon {
  background: var(--green);
  color: #fff;
}

.task-row.current .task-row-icon {
  background: var(--black);
  color: #fff;
}

.task-row-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 4px;
}

.task-row-top strong {
  font-size: 0.78rem;
  font-family: var(--font-mono);
  letter-spacing: var(--ls-mono);
  text-transform: uppercase;
  color: var(--text-muted);
}

.task-row-status {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-light);
}

.task-row-title {
  font-size: 0.96rem;
  font-weight: 620;
  color: var(--text);
  margin-bottom: 4px;
}

.task-row-main p {
  font-size: 0.82rem;
  color: var(--text-light);
  line-height: 1.55;
}

.task-row-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.task-row-side span {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text);
}

.task-row-side small {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: var(--ls-mono);
}

.task-panel {
  min-height: 680px;
}

.panel-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.panel-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(0,0,0,0.08);
}

.panel-badge.current {
  background: rgba(124,92,255,0.08);
  color: var(--purple-dark);
}

.panel-badge.done {
  background: rgba(47,180,108,0.08);
  color: var(--green-dark);
}

.panel-badge.locked {
  background: rgba(0,0,0,0.04);
  color: var(--text-light);
}

.panel-badge-icon {
  font-size: 14px;
}

.panel-points {
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--text-light);
}

.panel-title {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.panel-title-mark {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(0,0,0,0.96) 0%, rgba(53,53,53,1) 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: var(--shadow-md);
}

.panel-title h2 {
  font-size: clamp(1.5rem, 2.5vw, 2.4rem);
  margin: 4px 0 8px;
}

.panel-title p {
  max-width: 720px;
  color: var(--text-light);
  line-height: 1.7;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.panel-block {
  margin-bottom: 18px;
}

.block-label {
  margin-bottom: 10px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: var(--ls-mono);
  color: var(--text-muted);
}

.block-copy {
  color: var(--text);
  line-height: 1.75;
}

.difficulty-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 14px;
  border-radius: 16px;
  background: rgba(0,0,0,0.03);
}

.difficulty-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #111111 0%, #5b5b5b 100%);
}

.difficulty-text {
  margin-left: 2px;
  color: var(--text-light);
  font-size: 0.9rem;
}

.score-list {
  display: grid;
  gap: 10px;
}

.score-row {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  padding: 14px;
  border-radius: 16px;
  background: rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.06);
}

.score-points {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
}

.score-text {
  color: var(--text-light);
  line-height: 1.65;
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-chip {
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.08);
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-light);
}

.panel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 6px;
}

@media (max-width: 980px) {
  .tasks-hero,
  .tasks-shell,
  .panel-grid {
    grid-template-columns: 1fr;
  }

  .task-rail {
    position: static;
  }

  .task-panel {
    min-height: auto;
  }
}

@media (max-width: 640px) {
  .tasks-hero {
    gap: 14px;
  }

  .hero-metric,
  .task-row,
  .score-row {
    padding: 14px;
  }

  .panel-title {
    grid-template-columns: 1fr;
  }

  .panel-title-mark {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }

  .score-row {
    grid-template-columns: 1fr;
  }
}
</style>
