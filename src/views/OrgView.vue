<template>
  <div class="page org-page">
    <div class="container">
      <section class="org-hero card">
        <div>
          <div class="sbadge">Institution Console</div>
          <h1>{{ competitionStore.orgEnterprise?.enterpriseName || '机构端后台' }}</h1>
          <p>
            机构端只负责本机构学生的申请处理、邀请码发放、绑定关系和队伍查看。机构资质审核与开通不在这里，而在平台运营端。
          </p>
        </div>

        <div class="hero-grid">
          <article class="hero-metric">
            <span>机构状态</span>
            <strong>{{ enterpriseLabel(competitionStore.orgEnterprise?.status) }}</strong>
            <small>{{ competitionStore.orgEnterprise?.contactName }} · {{ competitionStore.orgEnterprise?.contactPhone }}</small>
          </article>
          <article class="hero-metric">
            <span>有效学员</span>
            <strong>{{ competitionStore.orgMetrics.activeStudents }} / {{ competitionStore.orgMetrics.totalQuota }}</strong>
            <small>剩余 {{ competitionStore.orgMetrics.remainingQuota }} 个有效名额</small>
          </article>
          <article class="hero-metric">
            <span>待审核申请</span>
            <strong>{{ competitionStore.orgMetrics.pendingApplications }}</strong>
            <small>{{ competitionStore.orgMetrics.unusedInvites }} 个未绑定邀请码</small>
          </article>
        </div>
      </section>

      <section class="review-section">
        <article class="card review-card">
          <div class="section-headline">
            <div>
              <div class="mono-label">Application Review</div>
              <h2>学生参赛申请审核</h2>
            </div>
            <span class="section-note">{{ competitionStore.orgPendingApplications.length }} 条待处理</span>
          </div>

          <div v-if="competitionStore.orgPendingApplications.length" class="review-list">
            <article v-for="application in competitionStore.orgPendingApplications" :key="application.id" class="review-row">
              <div>
                <strong>{{ application.studentName }}</strong>
                <p>{{ application.themeName }} · {{ formatTime(application.appliedAt) }}</p>
              </div>

              <div class="review-actions">
                <button type="button" class="btn btn-primary btn-sm" @click="handleApprove(application.id)">通过并绑定</button>
                <button type="button" class="btn btn-red btn-sm" @click="handleReject(application.id)">拒绝</button>
              </div>
            </article>
          </div>
          <div v-else class="empty-copy">当前没有待审核申请。</div>
        </article>
      </section>

      <section class="invite-section">
        <article class="card invite-card">
          <div class="section-headline">
            <div>
              <div class="mono-label">Invite Codes</div>
              <h2>邀请码管理</h2>
            </div>
            <span class="section-note">{{ competitionStore.orgInvites.length }} 条</span>
          </div>

          <div class="generator-list">
            <article
              v-for="theme in competitionStore.orgEnterprise?.openedThemes || []"
              :key="theme.id"
              class="generator-row"
            >
              <div>
                <strong>{{ theme.themeName }}</strong>
                <p>{{ theme.contentReady ? '学习内容已开放' : '报名入口已开放，学习内容准备中' }}</p>
              </div>
              <button type="button" class="btn btn-blue btn-sm" @click="handleGenerateInvites(theme.id)">
                生成 3 个码
              </button>
            </article>
          </div>

          <div class="divider"></div>

          <div v-if="paginatedInvites.length" class="invite-table-wrap">
            <div class="invite-table">
              <div class="invite-table-head">
                <span>邀请码</span>
                <span>主题</span>
                <span>状态管理</span>
                <span>学员姓名</span>
                <span>学员账号</span>
                <span>操作</span>
              </div>

              <div v-for="invite in paginatedInvites" :key="invite.id" class="invite-table-row">
                <strong>{{ invite.inviteCode }}</strong>
                <span>{{ invite.themeName }}</span>
                <span :class="['status-pill', invite.statusTone]">{{ invite.statusLabel }}</span>
                <span>{{ invite.studentName || '--' }}</span>
                <span>{{ invite.studentPhone || '--' }}</span>
                <button
                  v-if="invite.canUnbind"
                  type="button"
                  class="unlink-btn"
                  @click="openUnbindModal(invite)"
                >
                  解绑
                </button>
                <span v-else class="operation-empty">--</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-copy">当前还没有邀请码记录。</div>

          <div v-if="competitionStore.orgInvites.length > invitePageSize" class="pagination-bar">
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              :disabled="invitePage <= 1"
              @click="invitePage -= 1"
            >
              上一页
            </button>
            <span class="page-meta">第 {{ invitePage }} / {{ invitePageCount }} 页</span>
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              :disabled="invitePage >= invitePageCount"
              @click="invitePage += 1"
            >
              下一页
            </button>
          </div>
        </article>
      </section>

      <section class="detail-grid">
        <article class="card detail-card">
          <div class="section-headline">
            <div>
              <div class="mono-label">Bindings</div>
              <h2>已绑定学员</h2>
            </div>
            <span class="section-note">{{ competitionStore.orgBindings.length }} 条</span>
          </div>

          <div v-if="competitionStore.orgBindings.length" class="table-list">
            <div v-for="binding in competitionStore.orgBindings" :key="binding.id" class="table-row">
              <strong>{{ binding.userNickname }}</strong>
              <span>{{ binding.themeName }}</span>
              <span>{{ binding.inviteCode }}</span>
              <span :class="['status-text', binding.isCurrentEffective ? 'approved' : 'muted']">
                {{ binding.isCurrentEffective ? '当前有效' : '历史' }}
              </span>
            </div>
          </div>
          <div v-else class="empty-copy">当前机构还没有有效绑定记录。</div>
        </article>

        <article class="card detail-card">
          <div class="section-headline">
            <div>
              <div class="mono-label">Teams</div>
              <h2>当前组队情况</h2>
            </div>
            <span class="section-note">{{ competitionStore.orgTeams.length }} 支</span>
          </div>

          <div v-if="competitionStore.orgTeams.length" class="team-list">
            <button
              v-for="team in competitionStore.orgTeams"
              :key="team.id"
              type="button"
              class="team-row team-trigger"
              @click="openTeamModal(team)"
            >
              <div>
                <strong>{{ team.teamName }}</strong>
                <p>{{ team.themeName }} · {{ team.memberPhones.length }} / 5 人</p>
              </div>
              <div class="team-side">
                <span :class="['status-pill', team.status === 'locked' ? 'warn' : 'positive']">{{ teamStatusLabel(team.status) }}</span>
                <small>点击查看队员</small>
              </div>
            </button>
          </div>
          <div v-else class="empty-copy">当前还没有队伍记录。</div>
        </article>
      </section>

      <section class="card history-card">
        <div class="section-headline">
          <div>
            <div class="mono-label">History</div>
            <h2>历史队伍与历史申请</h2>
          </div>
        </div>

        <div class="history-grid">
          <div>
            <h3 class="subhead">历史队伍</h3>
            <div v-if="competitionStore.orgHistoryTeams.length" class="mini-list">
              <article v-for="team in competitionStore.orgHistoryTeams" :key="team.id" class="mini-row">
                <div>
                  <strong>{{ team.teamName }}</strong>
                  <p>{{ team.themeName }}</p>
                </div>
                <span class="status-pill neutral">已归档</span>
              </article>
            </div>
            <div v-else class="empty-copy">暂无历史队伍。</div>
          </div>

          <div>
            <h3 class="subhead">已处理申请</h3>
            <div class="mini-list">
              <article
                v-for="application in competitionStore.orgApplications.filter((item) => item.status !== 'pending').slice(0, 5)"
                :key="application.id"
                class="mini-row"
              >
                <div>
                  <strong>{{ application.studentName }}</strong>
                  <p>{{ application.themeName }}</p>
                </div>
                <span :class="['status-pill', application.status === 'approved' ? 'positive' : 'danger']">
                  {{ application.status === 'approved' ? '已通过' : '已拒绝' }}
                </span>
              </article>
            </div>
          </div>
        </div>
      </section>

      <p v-if="feedback" class="feedback-line">{{ feedback }}</p>
    </div>

    <div v-if="unbindTarget" class="modal-mask" @click.self="closeUnbindModal">
      <div class="modal-card">
        <div class="mono-label">Confirm Unbind</div>
        <h3>确认解绑该邀请码吗？</h3>
        <p class="modal-copy">
          {{ unbindTarget.inviteCode }} 当前绑定 {{ unbindTarget.studentName || unbindTarget.studentPhone }}。
          解绑后会同步作废当前绑定关系、将学员移出当前队伍，且邀请码永久失效，无法恢复。
        </p>

        <div class="modal-meta">
          <span>主题：{{ unbindTarget.themeName }}</span>
          <span>账号：{{ unbindTarget.studentPhone }}</span>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-ghost btn-lg" @click="closeUnbindModal">取消</button>
          <button
            type="button"
            class="btn btn-red btn-lg"
            :disabled="unbindCountdown > 0"
            @click="handleConfirmUnbind"
          >
            {{ unbindCountdown > 0 ? `${unbindCountdown}s 后可确认` : '确认解绑' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="activeTeam" class="modal-mask" @click.self="closeTeamModal">
      <div class="modal-card team-modal">
        <div class="mono-label">Team Members</div>
        <h3>{{ activeTeam.teamName }}</h3>
        <p class="modal-copy">{{ activeTeam.themeName }} · {{ teamStatusLabel(activeTeam.status) }}</p>

        <div class="member-list">
          <article v-for="member in activeTeam.memberNames" :key="member.phone" class="member-row">
            <div>
              <strong>{{ member.nickname }}</strong>
              <p>{{ member.phone }}</p>
            </div>
            <span :class="['status-pill', member.phone === activeTeam.captainPhone ? 'positive' : 'neutral']">
              {{ member.phone === activeTeam.captainPhone ? '队长' : '队员' }}
            </span>
          </article>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-primary btn-lg" @click="closeTeamModal">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useCompetitionStore } from '@/stores/competition.js'

const competitionStore = useCompetitionStore()
const feedback = ref('')

const invitePage = ref(1)
const invitePageSize = 10

const unbindTarget = ref(null)
const unbindCountdown = ref(0)
let unbindTimer = null

const activeTeam = ref(null)

const invitePageCount = computed(() => Math.max(1, Math.ceil(competitionStore.orgInvites.length / invitePageSize)))
const paginatedInvites = computed(() => {
  const start = (invitePage.value - 1) * invitePageSize
  return competitionStore.orgInvites.slice(start, start + invitePageSize)
})

watch(
  () => competitionStore.orgInvites.length,
  () => {
    if (invitePage.value > invitePageCount.value) invitePage.value = invitePageCount.value
  },
)

function setFeedback(result) {
  feedback.value = result.msg || ''
}

function handleApprove(applicationId) {
  setFeedback(competitionStore.approveApplication(applicationId))
}

function handleReject(applicationId) {
  setFeedback(competitionStore.rejectApplication(applicationId))
}

function handleGenerateInvites(themeId) {
  setFeedback(competitionStore.generateInvites({ themeId, count: 3 }))
  invitePage.value = 1
}

function openUnbindModal(invite) {
  closeUnbindTimer()
  unbindTarget.value = invite
  unbindCountdown.value = 3
  unbindTimer = window.setInterval(() => {
    if (unbindCountdown.value > 0) {
      unbindCountdown.value -= 1
    }
    if (unbindCountdown.value <= 0) {
      closeUnbindTimer()
    }
  }, 1000)
}

function closeUnbindTimer() {
  if (unbindTimer) {
    window.clearInterval(unbindTimer)
    unbindTimer = null
  }
}

function closeUnbindModal() {
  closeUnbindTimer()
  unbindTarget.value = null
  unbindCountdown.value = 0
}

function handleConfirmUnbind() {
  if (!unbindTarget.value || unbindCountdown.value > 0) return
  setFeedback(competitionStore.unbindInvite(unbindTarget.value.id))
  closeUnbindModal()
}

function openTeamModal(team) {
  activeTeam.value = team
}

function closeTeamModal() {
  activeTeam.value = null
}

function enterpriseLabel(status) {
  return {
    pending_review: '待审核',
    opened: '已开通',
    disabled: '已停用',
  }[status] || '未配置'
}

function teamStatusLabel(status) {
  return {
    forming: '组队中',
    full: '已满员',
    locked: '已锁队',
    completed: '已完成',
  }[status] || status
}

function formatTime(value) {
  if (!value) return '--'
  return new Date(value).toLocaleDateString('zh-CN')
}

onBeforeUnmount(() => {
  closeUnbindTimer()
})
</script>

<style scoped>
.org-page {
  animation: fadeSlideUp 0.32s ease;
}

.org-hero,
.review-section,
.invite-section,
.detail-grid,
.history-grid {
  display: grid;
  gap: 16px;
}

.org-hero {
  grid-template-columns: 1.08fr 0.92fr;
  margin-bottom: 18px;
}

.org-hero h1 {
  margin: 12px 0 10px;
  font-size: var(--page-title-size);
}

.org-hero p,
.hero-metric small,
.review-row p,
.generator-row p,
.mini-row p,
.table-row span,
.team-row p,
.invite-table-row span,
.member-row p,
.modal-copy {
  color: var(--text-light);
  line-height: 1.72;
}

.hero-grid {
  display: grid;
  gap: 12px;
}

.hero-metric,
.review-row,
.generator-row,
.mini-row,
.table-row,
.team-row {
  padding: 16px;
  border-radius: 18px;
  background: rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.06);
}

.hero-metric span,
.section-note,
.page-meta {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: var(--ls-mono);
  text-transform: uppercase;
}

.hero-metric strong {
  display: block;
  margin: 8px 0 4px;
  font-size: 1.2rem;
}

.review-section,
.invite-section,
.detail-grid {
  margin-bottom: 16px;
}

.section-headline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.review-list,
.generator-list,
.mini-list,
.table-list,
.team-list,
.member-list {
  display: grid;
  gap: 10px;
}

.review-row,
.generator-row,
.mini-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.review-row strong,
.generator-row strong,
.mini-row strong,
.table-row strong,
.team-row strong,
.member-row strong,
.invite-table-row strong {
  display: block;
  margin-bottom: 4px;
  font-size: 1rem;
}

.review-actions {
  display: flex;
  gap: 8px;
}

.invite-table-wrap {
  overflow-x: auto;
}

.invite-table {
  min-width: 840px;
}

.invite-table-head,
.invite-table-row {
  display: grid;
  grid-template-columns: 1.1fr 1.35fr 120px 1fr 1fr 70px;
  gap: 12px;
  align-items: center;
}

.invite-table-head {
  padding: 0 14px 10px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: var(--ls-mono);
  text-transform: uppercase;
  border-bottom: 1px solid rgba(0,0,0,0.08);
}

.invite-table-row {
  padding: 14px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

.invite-table-row:last-child {
  border-bottom: none;
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  align-items: center;
}

.status-pill {
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  width: fit-content;
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

.status-text.approved {
  color: var(--green-dark);
}

.status-text.muted {
  color: var(--text-muted);
}

.unlink-btn {
  border: none;
  background: transparent;
  color: var(--red-dark);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.unlink-btn:hover {
  text-decoration: underline;
}

.operation-empty {
  color: var(--text-muted);
}

.team-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.14s ease, box-shadow 0.18s ease, background 0.14s ease;
}

.team-trigger:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
  background: rgba(255,255,255,0.82);
}

.team-side {
  display: grid;
  justify-items: end;
  gap: 6px;
}

.team-side small,
.modal-meta span {
  color: var(--text-muted);
  font-size: 12px;
}

.history-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.subhead {
  margin-bottom: 12px;
}

.empty-copy,
.feedback-line {
  color: var(--text-light);
}

.feedback-line {
  margin-top: 14px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
}

.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(15, 15, 18, 0.42);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-card {
  width: min(560px, 100%);
  padding: 24px;
  border-radius: 28px;
  background: rgba(255,255,255,0.94);
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: var(--shadow-lg);
}

.modal-card h3 {
  font-size: 1.4rem;
  margin: 10px 0 10px;
}

.modal-meta {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  margin-top: 16px;
  border-radius: 18px;
  background: rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.06);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.team-modal {
  width: min(620px, 100%);
}

.member-row {
  padding: 16px;
  border-radius: 18px;
  background: rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

@media (max-width: 1080px) {
  .org-hero,
  .detail-grid,
  .history-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .review-row,
  .generator-row,
  .mini-row,
  .team-trigger,
  .member-row,
  .modal-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .table-row {
    grid-template-columns: 1fr;
  }

  .review-actions {
    flex-wrap: wrap;
  }

  .team-side {
    justify-items: start;
  }

  .pagination-bar {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
