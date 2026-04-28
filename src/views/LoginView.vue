<template>
  <div class="login-page">
    <div class="login-shell">
      <section class="login-intro">
        <div class="sbadge">POOK Access</div>
        <h1>选择你的入口，进入同一场成长旅程</h1>
        <p>
          学生在主题任务中探索与表达，机构负责组织与陪伴，平台运营端统筹合作准入、赛季主题与赛事规则。
        </p>

        <div class="intro-list">
          <article class="intro-card">
            <strong>学生端</strong>
            <span>登录后完成邀请码绑定或报名申请，进入所属主题，开始任务、学习与组队。</span>
          </article>
          <article class="intro-card">
            <strong>机构端</strong>
            <span>管理本机构学员报名、邀请码、绑定关系与组队进度，陪伴学生完成参赛准备。</span>
          </article>
          <article class="intro-card">
            <strong>平台运营端</strong>
            <span>负责机构开通、主题配置、名额管理与全局台账，保障赛事有序运行。</span>
          </article>
        </div>
      </section>

      <section class="login-box">
        <div class="brand-block">
          <div class="login-mark">P</div>
          <h2 class="login-title">POOK AI</h2>
          <p class="login-sub">Competition Platform Access</p>
        </div>

        <div class="role-tabs">
          <button :class="['rt', { active: roleTab === 'student' }]" @click="switchRole('student')">学生端</button>
          <button :class="['rt', { active: roleTab === 'org' }]" @click="switchRole('org')">机构端</button>
          <button :class="['rt', { active: roleTab === 'platform' }]" @click="switchRole('platform')">平台运营端</button>
        </div>

        <div v-if="roleTab !== 'platform'" class="auth-toggle">
          <button :class="['at', { active: authMode === 'login' }]" @click="switchMode('login')">登录</button>
          <button :class="['at', { active: authMode === 'register' }]" @click="switchMode('register')">注册</button>
        </div>

        <template v-if="roleTab === 'student'">
          <template v-if="authMode === 'login'">
            <div class="demo-list">
              <article v-for="demo in DEMO_STUDENTS" :key="demo.phone" class="demo-item">
                <div class="demo-item-head">
                  <span class="demo-label">学生演示账号</span>
                  <button class="demo-fill" @click="fillStudent(demo)">一键填充</button>
                </div>
                <div class="demo-item-meta">
                  <code>{{ demo.phone }}</code>
                  <code>{{ demo.password }}</code>
                  <span class="demo-theme">绑定主题：{{ demo.themeName }}</span>
                </div>
              </article>
            </div>

            <label class="field-label">手机号</label>
            <input v-model="phone" type="tel" maxlength="11" placeholder="请输入学生/家长手机号" class="field-input" />

            <label class="field-label">密码</label>
            <input v-model="password" type="password" placeholder="请输入密码" class="field-input" @keyup.enter="doStudentLogin" />

            <button class="btn btn-primary btn-block btn-lg" :disabled="!phone || !password" @click="doStudentLogin">
              进入学生端
            </button>
          </template>

          <template v-else>
            <label class="field-label">手机号</label>
            <input v-model="phone" type="tel" maxlength="11" placeholder="请输入学生/家长手机号" class="field-input" />

            <label class="field-label">密码</label>
            <input v-model="password" type="password" placeholder="至少 6 位密码" class="field-input" />

            <label class="field-label">昵称</label>
            <input v-model="nickname" placeholder="例如 小探索家" class="field-input" />

            <button class="btn btn-primary btn-block btn-lg" :disabled="!canStudentRegister" @click="doStudentRegister">
              完成注册
            </button>

            <p class="info-hint">注册成功后先进入学生工作台，再完成邀请码绑定或报名申请。</p>
          </template>
        </template>

        <template v-else-if="roleTab === 'org'">
          <template v-if="authMode === 'login'">
            <div class="demo-bar">
              <span class="demo-label">演示账号</span>
              <code>{{ DEMO_ENTERPRISE.phone }}</code>
              <code>{{ DEMO_ENTERPRISE.password }}</code>
              <button class="demo-fill" @click="fillOrg">一键填充</button>
            </div>

            <label class="field-label">联系人手机号</label>
            <input v-model="phone" type="tel" maxlength="11" placeholder="请输入机构联系人手机号" class="field-input" />

            <label class="field-label">密码</label>
            <input v-model="password" type="password" placeholder="请输入密码" class="field-input" @keyup.enter="doOrgLogin" />

            <button class="btn btn-primary btn-block btn-lg" :disabled="!phone || !password" @click="doOrgLogin">
              进入机构端
            </button>
          </template>

          <template v-else>
            <label class="field-label">机构名称</label>
            <input v-model="orgName" placeholder="请输入机构全称" class="field-input" />

            <label class="field-label">联系人姓名</label>
            <input v-model="contactName" placeholder="请输入联系人姓名" class="field-input" />

            <label class="field-label">联系人手机号</label>
            <input v-model="phone" type="tel" maxlength="11" placeholder="同时作为登录账号" class="field-input" />

            <label class="field-label">密码</label>
            <input v-model="password" type="password" placeholder="至少 6 位密码" class="field-input" />

            <button class="btn btn-primary btn-block btn-lg" :disabled="!canOrgRegister" @click="doOrgRegister">
              提交机构注册
            </button>

            <p class="info-hint">机构提交入驻信息后，需等待平台运营端开通后才能登录。</p>
          </template>
        </template>

        <template v-else>
          <div class="demo-bar">
            <span class="demo-label">平台演示账号</span>
            <code>{{ DEMO_PLATFORM.phone }}</code>
            <code>{{ DEMO_PLATFORM.password }}</code>
            <button class="demo-fill" @click="fillPlatform">一键填充</button>
          </div>

          <label class="field-label">平台账号</label>
          <input v-model="phone" type="tel" maxlength="11" placeholder="请输入平台账号" class="field-input" />

          <label class="field-label">密码</label>
          <input v-model="password" type="password" placeholder="请输入密码" class="field-input" @keyup.enter="doPlatformLogin" />

          <button class="btn btn-primary btn-block btn-lg" :disabled="!phone || !password" @click="doPlatformLogin">
            进入平台运营端
          </button>
        </template>

        <p v-if="message" :class="['message-line', messageOk ? 'ok' : 'err']">{{ message }}</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DEMO_ENTERPRISE,
  DEMO_PLATFORM,
  DEMO_STUDENT,
  DEMO_STUDENTS,
  useUserStore,
} from '@/stores/user.js'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const roleTab = ref(['student', 'org', 'platform'].includes(route.query.role) ? route.query.role : 'student')
const authMode = ref(roleTab.value === 'platform' ? 'login' : 'login')

const phone = ref('')
const password = ref('')
const nickname = ref('')
const orgName = ref('')
const contactName = ref('')
const message = ref('')
const messageOk = ref(true)

const canStudentRegister = computed(() =>
  phone.value.trim().length >= 11 &&
  password.value.length >= 6 &&
  nickname.value.trim().length > 0,
)

const canOrgRegister = computed(() =>
  orgName.value.trim().length > 0 &&
  contactName.value.trim().length > 0 &&
  phone.value.trim().length >= 11 &&
  password.value.length >= 6,
)

function resetFields() {
  phone.value = ''
  password.value = ''
  nickname.value = ''
  orgName.value = ''
  contactName.value = ''
  message.value = ''
}

function switchRole(role) {
  roleTab.value = role
  authMode.value = role === 'platform' ? 'login' : 'login'
  resetFields()
}

function switchMode(mode) {
  authMode.value = mode
  resetFields()
}

function setMessage(result) {
  messageOk.value = !!result.success
  message.value = result.msg || ''
}

function fillStudent(account = DEMO_STUDENT) {
  phone.value = account.phone
  password.value = account.password
}

function fillOrg() {
  phone.value = DEMO_ENTERPRISE.phone
  password.value = DEMO_ENTERPRISE.password
}

function fillPlatform() {
  phone.value = DEMO_PLATFORM.phone
  password.value = DEMO_PLATFORM.password
}

function doStudentLogin() {
  const result = userStore.loginStudent({ phone: phone.value.trim(), password: password.value })
  setMessage(result)
  if (result.success) router.push('/tasks')
}

function doStudentRegister() {
  const result = userStore.registerStudent({
    phone: phone.value.trim(),
    password: password.value,
    nickname: nickname.value.trim(),
  })
  setMessage(result)
  if (result.success) router.push('/tasks')
}

function doOrgLogin() {
  const result = userStore.loginOrg({ phone: phone.value.trim(), password: password.value })
  setMessage(result)
  if (result.success) router.push('/org')
}

function doOrgRegister() {
  const result = userStore.registerOrg({
    enterpriseName: orgName.value.trim(),
    contactName: contactName.value.trim(),
    contactPhone: phone.value.trim(),
    password: password.value,
  })
  setMessage(result)
  if (result.success) {
    authMode.value = 'login'
    phone.value = ''
    password.value = ''
  }
}

function doPlatformLogin() {
  const result = userStore.loginPlatform({ phone: phone.value.trim(), password: password.value })
  setMessage(result)
  if (result.success) router.push('/platform')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  padding: 120px 20px 48px;
}

.login-shell {
  max-width: 1160px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.08fr 500px;
  gap: 28px;
  align-items: start;
}

.login-intro {
  padding: 28px 14px 10px 8px;
}

.login-intro h1 {
  margin: 14px 0 12px;
  font-size: var(--page-title-size);
}

.login-intro p,
.intro-card span,
.info-hint {
  color: var(--text-light);
  line-height: 1.8;
}

.intro-list {
  display: grid;
  gap: 12px;
  margin-top: 24px;
}

.intro-card {
  padding: 16px 18px;
  border-radius: 20px;
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(0,0,0,0.08);
}

.intro-card strong {
  display: block;
  margin-bottom: 8px;
  font-size: 1rem;
}

.login-box {
  padding: 26px;
  border-radius: 28px;
  background: rgba(255,255,255,0.86);
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(18px);
}

.brand-block {
  text-align: center;
  margin-bottom: 24px;
}

.login-mark {
  width: 52px;
  height: 52px;
  margin: 0 auto 14px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 30% 30%, rgba(255,255,255,0.45) 0%, transparent 38%),
    #111111;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 700;
}

.login-title {
  font-size: 1.55rem;
  margin-bottom: 6px;
}

.login-sub {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: var(--ls-mono);
}

.role-tabs {
  display: grid;
  grid-template-columns: 0.9fr 0.9fr 1.2fr;
  gap: 6px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(0,0,0,0.04);
  margin-bottom: 18px;
}

.auth-toggle {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(0,0,0,0.04);
  margin-bottom: 18px;
}

.rt,
.at {
  min-height: 42px;
  min-width: 0;
  padding: 0 10px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--text-light);
  font-size: 12px;
  font-weight: 540;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.14s ease, color 0.14s ease, box-shadow 0.18s ease;
}

.rt.active,
.at.active {
  background: #111111;
  color: #ffffff;
  box-shadow: 0 10px 18px rgba(0,0,0,0.1);
}

.field-label {
  display: block;
  margin: 12px 0 8px;
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

.demo-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px 14px;
  margin-bottom: 16px;
  border-radius: 18px;
  background: rgba(0,0,0,0.035);
  border: 1px solid rgba(0,0,0,0.06);
}

.demo-list {
  display: grid;
  gap: 10px;
  margin-bottom: 16px;
}

.demo-item {
  padding: 12px 14px;
  border-radius: 18px;
  background: rgba(0,0,0,0.035);
  border: 1px solid rgba(0,0,0,0.06);
}

.demo-item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.demo-item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.demo-label {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: var(--ls-mono);
  color: var(--text-muted);
}

.demo-bar code {
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.95);
  display: inline-flex;
  align-items: center;
  font-size: 0.72rem;
}

.demo-item code {
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.95);
  display: inline-flex;
  align-items: center;
  font-size: 0.72rem;
}

.demo-fill {
  margin-left: auto;
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 999px;
  background: #111111;
  color: #fff;
  cursor: pointer;
}

.demo-item .demo-fill {
  margin-left: 0;
}

.demo-theme {
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.95);
  display: inline-flex;
  align-items: center;
  font-size: 0.72rem;
  color: var(--text-light);
}

.btn-block {
  margin-top: 18px;
}

.info-hint {
  margin-top: 14px;
  text-align: center;
  font-size: 13px;
}

.message-line {
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  font-weight: 700;
}

.message-line.ok {
  color: var(--green-dark);
}

.message-line.err {
  color: var(--red-dark);
}

@media (max-width: 1024px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .login-intro {
    padding: 8px 0 0;
  }
}

@media (max-width: 640px) {
  .role-tabs {
    grid-template-columns: 0.85fr 0.85fr 1.3fr;
  }

  .rt {
    font-size: 11px;
    padding: 0 8px;
  }
}
</style>
