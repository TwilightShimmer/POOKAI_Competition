<template>
  <div class="page platform-page">
    <div class="container">
      <section class="platform-hero card">
        <div>
          <div class="sbadge">Platform Console</div>
          <h1>平台运营后台</h1>
          <p>
            这里承接服务提供方视角的机构资质认定、主题权限配置、参赛名额调整和全局绑定关系查询。机构审核能力不在机构端，而在这里完成开通与停用。
          </p>
        </div>

        <div class="metrics-grid">
          <article class="metric-card">
            <span>机构总数</span>
            <strong>{{ competitionStore.platformMetrics.enterpriseCount }}</strong>
          </article>
          <article class="metric-card">
            <span>待审核机构</span>
            <strong>{{ competitionStore.platformMetrics.pendingEnterpriseCount }}</strong>
          </article>
          <article class="metric-card">
            <span>当前有效绑定</span>
            <strong>{{ competitionStore.platformMetrics.effectiveBindingCount }}</strong>
          </article>
          <article class="metric-card">
            <span>待审核学生申请</span>
            <strong>{{ competitionStore.platformMetrics.pendingApplicationCount }}</strong>
          </article>
        </div>
      </section>

      <section class="platform-grid">
        <article class="card institution-card">
          <div class="section-headline">
            <div>
              <div class="mono-label">Institutions</div>
              <h2>机构资质与开通状态</h2>
            </div>
            <span class="section-note">{{ competitionStore.platformEnterprises.length }} 家</span>
          </div>

          <div class="institution-list">
            <article v-for="enterprise in competitionStore.platformEnterprises" :key="enterprise.id" class="institution-row">
              <div class="institution-main">
                <div class="institution-top">
                  <strong>{{ enterprise.enterpriseName }}</strong>
                  <span :class="['status-pill', enterpriseTone(enterprise.status)]">{{ enterpriseLabel(enterprise.status) }}</span>
                </div>
                <p>{{ enterprise.contactName }} · {{ enterprise.contactPhone }}</p>
                <small>有效学员 {{ enterprise.activeCount }} / {{ enterprise.totalQuota }} · 待审 {{ enterprise.pendingCount }}</small>
                <div class="theme-chip-row">
                  <span
                    v-for="theme in competitionStore.themeList"
                    :key="theme.id"
                    :class="['theme-chip', { active: enterprise.openedThemeIds.includes(theme.id) }]"
                    @click="handleToggleTheme(enterprise.id, theme.id)"
                  >
                    {{ theme.code }}
                  </span>
                </div>
              </div>

              <div class="institution-actions">
                <button
                  v-if="enterprise.status !== 'opened'"
                  type="button"
                  class="btn btn-primary btn-sm"
                  @click="handleReviewEnterprise(enterprise.id, 'opened')"
                >
                  开通机构
                </button>
                <button
                  v-else
                  type="button"
                  class="btn btn-ghost btn-sm"
                  @click="handleReviewEnterprise(enterprise.id, 'disabled')"
                >
                  停用机构
                </button>
                <div class="quota-editor">
                  <input
                    :value="quotaInputByEnterprise[enterprise.id] ?? enterprise.totalQuota"
                    type="number"
                    min="1"
                    step="1"
                    inputmode="numeric"
                    class="quota-input"
                    placeholder="输入总名额"
                    @input="quotaInputByEnterprise[enterprise.id] = $event.target.value"
                  />
                  <button
                    type="button"
                    class="btn btn-gold btn-sm"
                    :disabled="!isPositiveInteger(quotaInputByEnterprise[enterprise.id] ?? enterprise.totalQuota)"
                    @click="handleUpdateQuota(enterprise.id, quotaInputByEnterprise[enterprise.id] ?? enterprise.totalQuota)"
                  >
                    保存名额
                  </button>
                </div>
              </div>
            </article>
          </div>
        </article>

        <div class="stack-col">
          <article class="card themes-card">
            <div class="section-headline">
              <div>
                <div class="mono-label">Themes</div>
                <h2>赛季主题配置</h2>
              </div>
            </div>

            <div class="theme-list">
              <article v-for="theme in competitionStore.themeList" :key="theme.id" class="theme-row">
                <div>
                  <strong>{{ theme.themeName }}</strong>
                  <p>{{ theme.difficultyLevel }} · {{ theme.status === 'active' ? '赛季中' : '已归档' }}</p>
                </div>
                <span :class="['status-pill', theme.contentReady ? 'positive' : 'warn']">
                  {{ theme.contentReady ? '内容已接入' : '内容待接入' }}
                </span>
              </article>
            </div>
          </article>

        </div>
      </section>

      <section class="detail-grid">
        <article class="card detail-card">
          <div class="section-headline">
            <div>
              <div class="mono-label">Bindings</div>
              <h2>全局绑定关系</h2>
            </div>
          </div>

          <div class="table-list">
            <div v-for="binding in competitionStore.platformBindings.slice(0, 8)" :key="binding.id" class="table-row">
              <strong>{{ binding.userNickname }}</strong>
              <span>{{ binding.enterpriseName }}</span>
              <span>{{ binding.themeName }}</span>
              <span>{{ binding.seasonName }}</span>
            </div>
          </div>
        </article>

        <article class="card detail-card">
          <div class="section-headline">
            <div>
              <div class="mono-label">Applications</div>
              <h2>全局学生申请</h2>
            </div>
          </div>

          <div class="table-list">
            <div v-for="application in competitionStore.platformApplications.slice(0, 8)" :key="application.id" class="table-row">
              <strong>{{ application.studentName }}</strong>
              <span>{{ application.enterpriseName }}</span>
              <span>{{ application.themeName }}</span>
              <span :class="['status-text', application.status]">{{ appLabel(application.status) }}</span>
            </div>
          </div>
        </article>
      </section>

      <p v-if="feedback" class="feedback-line">{{ feedback }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useCompetitionStore } from '@/stores/competition.js'

const competitionStore = useCompetitionStore()
const feedback = ref('')
const quotaInputByEnterprise = reactive({})

function setFeedback(result) {
  feedback.value = result.msg || ''
}

function handleReviewEnterprise(enterpriseId, status) {
  setFeedback(competitionStore.reviewEnterprise(enterpriseId, { status }))
}

function handleUpdateQuota(enterpriseId, rawQuota) {
  const normalizedQuota = Number(rawQuota)
  const result = competitionStore.updateEnterpriseQuota(enterpriseId, normalizedQuota)
  setFeedback(result)
  if (result.success) quotaInputByEnterprise[enterpriseId] = String(normalizedQuota)
}

function handleToggleTheme(enterpriseId, themeId) {
  setFeedback(competitionStore.toggleEnterpriseTheme(enterpriseId, themeId))
}

function isPositiveInteger(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0
}

function enterpriseLabel(status) {
  return {
    pending_review: '待审核',
    opened: '已开通',
    disabled: '已停用',
  }[status] || status
}

function enterpriseTone(status) {
  return {
    pending_review: 'warn',
    opened: 'positive',
    disabled: 'danger',
  }[status] || 'neutral'
}

function appLabel(status) {
  return {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
  }[status] || status
}
</script>

<style scoped>
.platform-page {
  animation: fadeSlideUp 0.32s ease;
}

.platform-hero,
.platform-grid,
.detail-grid {
  display: grid;
  gap: 18px;
}

.platform-hero {
  grid-template-columns: 1.1fr 0.9fr;
  margin-bottom: 18px;
}

.platform-hero h1 {
  margin: 12px 0 10px;
  font-size: var(--page-title-size);
}

.platform-hero p,
.institution-main p,
.institution-main small,
.theme-row p,
.mini-row p,
.table-row span {
  color: var(--text-light);
  line-height: 1.72;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.metric-card,
.theme-row,
.mini-row,
.table-row {
  padding: 16px;
  border-radius: 18px;
  background: rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.06);
}

.metric-card span,
.section-note {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: var(--ls-mono);
  text-transform: uppercase;
}

.metric-card strong {
  display: block;
  margin-top: 8px;
  font-size: 1.8rem;
}

.platform-grid {
  grid-template-columns: 1.18fr 0.82fr;
  margin-bottom: 16px;
}

.stack-col {
  display: grid;
  gap: 16px;
}

.section-headline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.institution-list,
.theme-list,
.table-list {
  display: grid;
  gap: 10px;
}

.institution-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 16px;
  padding: 16px;
  border-radius: 20px;
  background: rgba(0,0,0,0.025);
  border: 1px solid rgba(0,0,0,0.06);
}

.institution-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.institution-top strong,
.theme-row strong,
.table-row strong {
  font-size: 1rem;
}

.institution-actions {
  display: grid;
  gap: 8px;
}

.quota-editor {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
}

.quota-input {
  width: 100%;
  min-height: 38px;
  padding: 0 12px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.92);
}

.theme-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.theme-chip {
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.8);
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
}

.theme-chip.active {
  background: #111111;
  color: #ffffff;
}

.status-pill {
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
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

.theme-row,
.table-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.detail-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.status-text.pending {
  color: var(--orange-dark);
}

.status-text.approved {
  color: var(--green-dark);
}

.status-text.rejected {
  color: var(--red-dark);
}

.feedback-line {
  margin-top: 14px;
  color: var(--text);
  font-size: 13px;
  font-weight: 700;
}

@media (max-width: 1080px) {
  .platform-hero,
  .platform-grid,
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .institution-row,
  .theme-row,
  .table-row {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
