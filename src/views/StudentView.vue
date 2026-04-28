<template>
  <div class="page student-page">
    <div class="container">
      <section class="student-hero card">
        <div>
          <div class="sbadge">Student Console</div>
          <h1>学生参赛工作台</h1>
          <p>
            这里可以查看当前赛季绑定状态、邀请码、机构审核进度和组队信息。完成绑定后即可进入任务与学习内容。
          </p>
        </div>

        <div class="hero-stack">
          <div class="hero-metric">
            <span class="metric-label">当前赛季</span>
            <strong>{{ userStore.currentSeasonName || '未配置赛季' }}</strong>
            <small>{{ statusTitle }}</small>
          </div>
          <div class="hero-metric">
            <span class="metric-label">当前机构</span>
            <strong>{{ userStore.orgName || '未绑定机构' }}</strong>
            <small>{{ binding ? binding.themeName : '需先绑定后进入赛事主题' }}</small>
          </div>
          <div class="hero-metric">
            <span class="metric-label">当前队伍</span>
            <strong>{{ team?.teamName || '未加入队伍' }}</strong>
            <small>{{ team ? `${team.memberPhones.length} / 5 人` : '支持 1 - 5 人组队' }}</small>
          </div>
        </div>
      </section>

      <section class="status-grid">
        <article class="card status-card primary">
          <div class="status-top">
            <div>
              <div class="mono-label">绑定状态</div>
              <h2>{{ statusTitle }}</h2>
            </div>
            <span :class="['status-pill', statusTone]">{{ statusTitle }}</span>
          </div>

          <p class="status-copy">
            {{ statusCopy }}
          </p>

          <div v-if="binding" class="binding-grid">
            <div class="binding-block">
              <span>绑定机构</span>
              <strong>{{ binding.enterpriseName }}</strong>
            </div>
            <div class="binding-block">
              <span>当前主题</span>
              <strong>{{ binding.themeName }}</strong>
            </div>
            <div class="binding-block">
              <span>邀请码</span>
              <strong>{{ binding.inviteCode }}</strong>
            </div>
            <div class="binding-block">
              <span>内容权限</span>
              <strong>{{ binding.contentReady ? '已开放' : '内容准备中' }}</strong>
            </div>
          </div>

          <div v-if="binding" class="status-actions">
            <router-link
              v-if="binding.contentReady"
              to="/tasks"
              class="btn btn-primary btn-lg"
            >
              进入任务台
            </router-link>
            <button
              v-else
              type="button"
              class="btn btn-ghost btn-lg"
              disabled
            >
              当前主题内容准备中
            </button>
            <router-link v-if="binding.contentReady" to="/report" class="btn btn-gold btn-lg">查看成长报告</router-link>
          </div>
        </article>

        <article class="card side-card">
          <div class="mono-label">公开浏览权限</div>
          <h3>未绑定也能看的内容</h3>
          <ul class="simple-list">
            <li>平台首页和赛事介绍</li>
            <li>登录、注册和申请入口</li>
            <li>当前申请记录与历史绑定</li>
          </ul>
          <div class="divider"></div>
          <div class="mono-label">绑定后开放</div>
          <ul class="simple-list">
            <li>任务详情、题目与学习页</li>
            <li>知识图谱、成长报告</li>
            <li>队伍创建、加入与锁队</li>
          </ul>
        </article>
      </section>

      <section v-if="!binding" class="entry-grid">
        <article class="card entry-card">
          <div class="mono-label">Path A</div>
          <h3>使用邀请码直接绑定</h3>
          <p>适合已经从机构老师拿到邀请码的学生账号。系统会校验机构状态、主题权限和当前有效名额。</p>

          <label class="field-label">邀请码</label>
          <input v-model="inviteCode" class="field-input" placeholder="如 MOON1002" />

          <button type="button" class="btn btn-primary btn-lg btn-block" :disabled="!inviteCode.trim()" @click="handleBind">
            完成绑定
          </button>
        </article>

        <article class="card entry-card">
          <div class="mono-label">Path B</div>
          <h3>提交参赛申请给机构审核</h3>
          <p>适合还没有邀请码的账号。申请提交后，由机构端审核通过并完成绑定。</p>

          <label class="field-label">目标机构</label>
          <select v-model="selectedEnterpriseId" class="field-input select-input">
            <option value="">请选择机构</option>
            <option v-for="enterprise in competitionStore.studentAvailableEnterprises" :key="enterprise.id" :value="enterprise.id">
              {{ enterprise.enterpriseName }} · 剩余 {{ enterprise.remainingQuota }} 席
            </option>
          </select>

          <label class="field-label">赛事主题</label>
          <select v-model="selectedThemeId" class="field-input select-input">
            <option value="">请选择主题</option>
            <option v-for="theme in filteredThemes" :key="theme.id" :value="theme.id">
              {{ theme.themeName }} {{ theme.contentReady ? '' : '· 内容准备中' }}
            </option>
          </select>

          <button
            type="button"
            class="btn btn-primary btn-lg btn-block"
            :disabled="!selectedEnterpriseId || !selectedThemeId"
            @click="handleApply"
          >
            提交申请
          </button>
        </article>
      </section>

      <section class="card applications-card">
        <div class="section-headline">
          <div>
            <div class="mono-label">Applications</div>
            <h2>我的申请记录</h2>
          </div>
          <span class="section-note">{{ competitionStore.studentApplications.length }} 条</span>
        </div>

        <div v-if="competitionStore.studentApplications.length" class="application-list">
          <article v-for="application in competitionStore.studentApplications" :key="application.id" class="application-row">
            <div class="application-main">
              <strong>{{ application.enterpriseName }}</strong>
              <p>{{ application.themeName }} · {{ formatTime(application.appliedAt) }}</p>
            </div>
            <div class="application-side">
              <span :class="['status-pill', appTone(application.status)]">{{ appLabel(application.status) }}</span>
              <small v-if="application.rejectReason">{{ application.rejectReason }}</small>
              <small v-else-if="application.assignedInviteCode">邀请码 {{ application.assignedInviteCode }}</small>
            </div>
          </article>
        </div>
        <div v-else class="empty-copy">当前还没有提交过参赛申请。</div>
      </section>

      <section v-if="binding" class="team-grid">
        <article class="card team-card">
          <div class="section-headline">
            <div>
              <div class="mono-label">Team</div>
              <h2>当前组队状态</h2>
            </div>
            <span v-if="team" :class="['status-pill', team.status === 'locked' ? 'neutral' : 'positive']">
              {{ teamStatusLabel(team.status) }}
            </span>
          </div>

          <template v-if="team">
            <div class="team-summary">
              <strong>{{ team.teamName }}</strong>
              <p>{{ team.enterpriseName }} · {{ team.themeName }}</p>
            </div>

            <div class="member-list">
              <div v-for="member in team.memberNames" :key="member.phone" class="member-chip">
                <span>{{ member.nickname }}</span>
                <small v-if="member.phone === team.captainPhone">队长</small>
              </div>
            </div>

            <div class="status-actions">
              <button type="button" class="btn btn-ghost btn-lg" :disabled="team.status === 'locked'" @click="handleLeaveTeam">
                退出队伍
              </button>
              <button
                type="button"
                class="btn btn-primary btn-lg"
                :disabled="team.captainPhone !== userStore.currentUserPhone || team.status === 'locked'"
                @click="handleLockTeam"
              >
                锁定队伍
              </button>
            </div>
          </template>

          <template v-else>
            <p class="empty-copy">
              当前还没有加入任何队伍。你可以先创建自己的队伍，也可以加入同机构同主题的现有队伍。
            </p>

            <label class="field-label">队伍名称</label>
            <input v-model="teamName" class="field-input" placeholder="例如 月球侦察队" />

            <button type="button" class="btn btn-primary btn-lg btn-block" :disabled="!teamName.trim()" @click="handleCreateTeam">
              创建队伍
            </button>
          </template>
        </article>

        <article class="card team-card">
          <div class="section-headline">
            <div>
              <div class="mono-label">Open Teams</div>
              <h2>可加入队伍</h2>
            </div>
            <span class="section-note">{{ competitionStore.studentAvailableTeams.length }} 支</span>
          </div>

          <div v-if="competitionStore.studentAvailableTeams.length" class="team-list">
            <article v-for="item in competitionStore.studentAvailableTeams" :key="item.id" class="team-row">
              <div>
                <strong>{{ item.teamName }}</strong>
                <p>{{ item.memberPhones.length }} / 5 人 · {{ teamStatusLabel(item.status) }}</p>
              </div>
              <button
                type="button"
                class="btn btn-ghost btn-sm"
                :disabled="!!team || item.status === 'locked' || item.memberPhones.length >= 5"
                @click="handleJoinTeam(item.id)"
              >
                加入
              </button>
            </article>
          </div>
          <div v-else class="empty-copy">当前主题下还没有开放队伍。</div>
        </article>
      </section>

      <section class="card history-card">
        <div class="section-headline">
          <div>
            <div class="mono-label">History</div>
            <h2>历史参赛记录</h2>
          </div>
        </div>

        <div v-if="competitionStore.studentHistoryBindings.length" class="history-list">
          <article v-for="item in competitionStore.studentHistoryBindings" :key="item.id" class="history-row">
            <strong>{{ item.seasonName }}</strong>
            <p>{{ item.enterpriseName }} · {{ item.themeName }}</p>
            <span>{{ item.status === 'completed' ? '赛季已结束' : '历史绑定' }}</span>
          </article>
        </div>
        <div v-else class="empty-copy">当前账号还没有历史赛季记录。</div>
      </section>

      <p v-if="feedback.message" :class="['feedback-line', feedback.ok ? 'ok' : 'err']">{{ feedback.message }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useCompetitionStore } from '@/stores/competition.js'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()
const competitionStore = useCompetitionStore()

const inviteCode = ref('')
const selectedEnterpriseId = ref('')
const selectedThemeId = ref('')
const teamName = ref('')
const feedback = ref({ ok: true, message: '' })

const binding = computed(() => competitionStore.studentBinding)
const team = computed(() => competitionStore.studentTeam)

const selectedEnterprise = computed(() =>
  competitionStore.studentAvailableEnterprises.find((item) => item.id === selectedEnterpriseId.value) || null,
)

const filteredThemes = computed(() => {
  if (!selectedEnterprise.value) return competitionStore.studentAvailableThemes
  const openedThemeIds = new Set(selectedEnterprise.value.openedThemeIds)
  return competitionStore.studentAvailableThemes.filter((theme) => openedThemeIds.has(theme.id))
})

watch(selectedEnterpriseId, () => {
  selectedThemeId.value = ''
})

const statusTitle = computed(() => {
  if (binding.value) return binding.value.contentReady ? '已绑定并开放内容' : '已绑定，等待内容开放'
  if (competitionStore.studentApplications.some((item) => item.status === 'pending')) return '申请审核中'
  return '未绑定，暂无学习权限'
})

const statusTone = computed(() => {
  if (binding.value?.contentReady) return 'positive'
  if (binding.value) return 'warn'
  if (competitionStore.studentApplications.some((item) => item.status === 'pending')) return 'warn'
  return 'neutral'
})

const statusCopy = computed(() => {
  if (binding.value?.contentReady) {
    return '当前赛季已经完成有效绑定，可以进入任务详情、题目、知识图谱和成长报告。'
  }
  if (binding.value) {
    return '当前赛季已经完成有效绑定，但当前主题的学习内容暂未开放，因此暂时只能查看绑定与组队信息。'
  }
  if (competitionStore.studentApplications.some((item) => item.status === 'pending')) {
    return '当前账号已有待审核申请。审核前不可查看任务详情，也不可创建或加入队伍。'
  }
  return '当前账号尚未绑定任何机构主题，可先查看公开信息并完成报名或绑定。'
})

function setFeedback(result) {
  feedback.value = {
    ok: !!result.success,
    message: result.msg || '',
  }
}

function handleBind() {
  const result = competitionStore.bindByInviteCode(inviteCode.value)
  setFeedback(result)
  if (result.success) inviteCode.value = ''
}

function handleApply() {
  const result = competitionStore.submitApplication({
    enterpriseId: selectedEnterpriseId.value,
    themeId: selectedThemeId.value,
  })
  setFeedback(result)
  if (result.success) {
    selectedEnterpriseId.value = ''
    selectedThemeId.value = ''
  }
}

function handleCreateTeam() {
  const result = competitionStore.createTeam(teamName.value)
  setFeedback(result)
  if (result.success) teamName.value = ''
}

function handleJoinTeam(teamId) {
  setFeedback(competitionStore.joinTeam(teamId))
}

function handleLeaveTeam() {
  setFeedback(competitionStore.leaveTeam())
}

function handleLockTeam() {
  setFeedback(competitionStore.lockTeam())
}

function appLabel(status) {
  return {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
  }[status] || status
}

function appTone(status) {
  return {
    pending: 'warn',
    approved: 'positive',
    rejected: 'danger',
  }[status] || 'neutral'
}

function teamStatusLabel(status) {
  return {
    forming: '组队中',
    full: '已满员',
    locked: '已锁队',
    completed: '已完成',
  }[status] || '未知状态'
}

function formatTime(value) {
  if (!value) return '--'
  return new Date(value).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.student-page {
  animation: fadeSlideUp 0.32s ease;
}

.student-hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 20px;
  margin-bottom: 18px;
}

.student-hero h1 {
  margin: 12px 0 10px;
  font-size: var(--page-title-size);
}

.student-hero p,
.status-copy,
.entry-card p,
.empty-copy,
.history-row p,
.team-row p,
.application-row p {
  color: var(--text-light);
  line-height: 1.72;
}

.hero-stack,
.binding-grid,
.entry-grid,
.team-grid,
.status-grid {
  display: grid;
  gap: 12px;
}

.hero-metric,
.binding-block {
  padding: 16px;
  border-radius: 18px;
  background: rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.06);
}

.metric-label,
.binding-block span,
.section-note {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: var(--ls-mono);
  text-transform: uppercase;
}

.hero-metric strong,
.binding-block strong {
  display: block;
  margin: 8px 0 4px;
  font-size: 1rem;
}

.hero-metric small {
  color: var(--text-light);
}

.status-grid,
.entry-grid,
.team-grid {
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  margin-bottom: 16px;
}

.status-card,
.entry-card,
.applications-card,
.team-card,
.history-card,
.side-card {
  min-height: 100%;
}

.status-top,
.section-headline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.status-pill {
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.status-pill.positive {
  background: rgba(47,180,108,0.12);
  color: var(--green-dark);
}

.status-pill.warn {
  background: rgba(255,159,10,0.12);
  color: var(--orange-dark);
}

.status-pill.danger {
  background: rgba(229,72,77,0.12);
  color: var(--red-dark);
}

.status-pill.neutral {
  background: rgba(0,0,0,0.05);
  color: var(--text-light);
}

.status-card.primary {
  position: relative;
  overflow: hidden;
}

.status-card.primary::after {
  content: '';
  position: absolute;
  inset: auto -10% -40% auto;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(35,131,226,0.12) 0%, transparent 62%);
  pointer-events: none;
}

.binding-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 18px;
}

.status-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.simple-list {
  display: grid;
  gap: 10px;
  margin-top: 12px;
  color: var(--text-light);
}

.simple-list li {
  position: relative;
  padding-left: 16px;
}

.simple-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #111111;
}

.field-label {
  display: block;
  margin: 14px 0 8px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: var(--ls-mono);
}

.field-input {
  width: 100%;
  min-height: 46px;
  padding: 0 14px;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.92);
}

.field-input:focus {
  border-color: rgba(0,0,0,0.18);
  box-shadow: 0 0 0 4px rgba(0,0,0,0.04);
}

.select-input {
  appearance: none;
}

.application-list,
.team-list,
.history-list {
  display: grid;
  gap: 10px;
}

.application-row,
.team-row,
.history-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.06);
}

.application-main strong,
.team-row strong,
.history-row strong,
.team-summary strong {
  display: block;
  margin-bottom: 4px;
  font-size: 1rem;
}

.application-side {
  display: grid;
  justify-items: end;
  gap: 6px;
}

.application-side small,
.history-row span {
  color: var(--text-muted);
  font-size: 12px;
  text-align: right;
}

.team-summary {
  padding: 14px 0 2px;
}

.member-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.member-chip {
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.08);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
}

.member-chip small {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
}

.feedback-line {
  margin-top: 14px;
  font-size: 13px;
  font-weight: 700;
}

.feedback-line.ok {
  color: var(--green-dark);
}

.feedback-line.err {
  color: var(--red-dark);
}

@media (max-width: 960px) {
  .student-hero,
  .status-grid,
  .entry-grid,
  .team-grid,
  .binding-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .status-top,
  .section-headline,
  .application-row,
  .team-row,
  .history-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .application-side {
    justify-items: start;
  }
}
</style>
