import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { themeInfo } from '@/mock/inviteCodes.js'
import {
  PLATFORM_ACCOUNT,
  createEnterpriseRecord,
  createStudentUser,
  getCurrentSeason,
  getEffectiveBinding,
  getEnterpriseById,
  getPrdEnterprises,
  getThemeById,
  getUserByPhone,
  getActiveTeamForUser,
  seedPrdData,
} from '@/mock/prdDb.js'

const SESSION_KEYS = {
  loggedIn: 'pook_logged_in',
  role: 'pook_role',
  nickname: 'pook_nickname',
  inviteCode: 'pook_invite_code',
  team: 'pook_team',
  org: 'pook_org',
  theme: 'pook_theme',
  userPhone: 'pook_user_phone',
  enterpriseId: 'pook_enterprise_id',
}

export const DEMO_STUDENTS = [
  { phone: '13800000001', password: '123456', themeName: '月球行动·基础主题' },
  { phone: '13800000006', password: '123456', themeName: '火星探索·进阶主题' },
]
export const DEMO_STUDENT = DEMO_STUDENTS[0]
export const DEMO_ENTERPRISE = { phone: '13900000001', password: '123456' }
export const DEMO_PLATFORM = { ...PLATFORM_ACCOUNT }

function readString(key, fallback = '') {
  if (typeof localStorage === 'undefined') return fallback
  return localStorage.getItem(key) || fallback
}

function writeString(key, value) {
  if (typeof localStorage === 'undefined') return
  if (value === undefined || value === null || value === '') localStorage.removeItem(key)
  else localStorage.setItem(key, value)
}

function clearSessionStorage() {
  if (typeof localStorage === 'undefined') return
  Object.values(SESSION_KEYS).forEach((key) => localStorage.removeItem(key))
}

function findEnterpriseByPhone(phone, enterprises = getPrdEnterprises()) {
  return enterprises.find((enterprise) => enterprise.contactPhone === phone) || null
}

export const useUserStore = defineStore('user', () => {
  seedPrdData()

  const isLoggedIn = ref(readString(SESSION_KEYS.loggedIn) === 'true')
  const currentRole = ref(JSON.parse(readString(SESSION_KEYS.role, '"student"')))
  const currentUserPhone = ref(readString(SESSION_KEYS.userPhone))
  const currentEnterpriseId = ref(readString(SESSION_KEYS.enterpriseId))

  const nickname = ref(readString(SESSION_KEYS.nickname))
  const ageGroup = ref(readString('pook_age', '6-8'))
  const inviteCode = ref(readString(SESSION_KEYS.inviteCode))
  const teamName = ref(readString(SESSION_KEYS.team))
  const orgName = ref(readString(SESSION_KEYS.org))
  const currentTheme = ref(readString(SESSION_KEYS.theme, 'moon'))
  const currentThemeName = ref('')
  const currentSeasonName = ref('')
  const accountStatus = ref('')
  const themeContentReady = ref(false)

  const roleLabel = computed(() => ({
    student: '学生端',
    org: '机构端',
    platform: '平台运营端',
  }[currentRole.value] || '访客'))

  const themeData = computed(() => themeInfo[currentTheme.value] || themeInfo.moon)

  function saveSession() {
    writeString(SESSION_KEYS.loggedIn, isLoggedIn.value ? 'true' : '')
    writeString(SESSION_KEYS.role, JSON.stringify(currentRole.value))
    writeString(SESSION_KEYS.nickname, nickname.value)
    writeString(SESSION_KEYS.inviteCode, inviteCode.value)
    writeString(SESSION_KEYS.team, teamName.value)
    writeString(SESSION_KEYS.org, orgName.value)
    writeString(SESSION_KEYS.theme, currentTheme.value)
    writeString(SESSION_KEYS.userPhone, currentUserPhone.value)
    writeString(SESSION_KEYS.enterpriseId, currentEnterpriseId.value)
  }

  function refreshProfileFromDb() {
    seedPrdData()

    const season = getCurrentSeason()
    currentSeasonName.value = season?.name || ''

    if (!isLoggedIn.value) {
      nickname.value = ''
      inviteCode.value = ''
      teamName.value = ''
      orgName.value = ''
      currentTheme.value = 'moon'
      currentThemeName.value = themeInfo.moon.name
      accountStatus.value = ''
      themeContentReady.value = false
      currentUserPhone.value = ''
      currentEnterpriseId.value = ''
      saveSession()
      return
    }

    if (currentRole.value === 'platform') {
      nickname.value = PLATFORM_ACCOUNT.nickname
      inviteCode.value = ''
      teamName.value = ''
      orgName.value = 'POOK 平台运营'
      currentTheme.value = 'moon'
      currentThemeName.value = '全局运营视角'
      accountStatus.value = 'active'
      themeContentReady.value = true
      currentUserPhone.value = PLATFORM_ACCOUNT.phone
      currentEnterpriseId.value = ''
      saveSession()
      return
    }

    if (currentRole.value === 'org') {
      const enterprises = getPrdEnterprises()
      const enterprise =
        getEnterpriseById(currentEnterpriseId.value, enterprises) ||
        findEnterpriseByPhone(currentUserPhone.value, enterprises)

      if (!enterprise) {
        logout()
        return
      }

      const firstTheme = enterprise.openedThemeIds?.length ? getThemeById(enterprise.openedThemeIds[0]) : null
      currentUserPhone.value = enterprise.contactPhone
      currentEnterpriseId.value = enterprise.id
      nickname.value = enterprise.contactName
      orgName.value = enterprise.enterpriseName
      inviteCode.value = ''
      teamName.value = ''
      currentTheme.value = firstTheme?.themeKey || 'moon'
      currentThemeName.value = firstTheme?.themeName || '待平台开通主题'
      accountStatus.value = enterprise.status
      themeContentReady.value = !!firstTheme?.contentReady
      saveSession()
      return
    }

    const user = getUserByPhone(currentUserPhone.value)
    if (!user) {
      logout()
      return
    }

    const binding = getEffectiveBinding(user.phone, season?.id)
    const theme = binding ? getThemeById(binding.themeId) : null
    const team = getActiveTeamForUser(user.phone, season?.id)

    currentUserPhone.value = user.phone
    currentEnterpriseId.value = binding?.enterpriseId || ''
    nickname.value = user.nickname
    inviteCode.value = binding?.inviteCode || ''
    teamName.value = team?.teamName || ''
    orgName.value = binding?.enterpriseName || ''
    currentTheme.value = theme?.themeKey || 'moon'
    currentThemeName.value = binding?.themeName || themeInfo[currentTheme.value]?.name || themeInfo.moon.name
    accountStatus.value = user.status || 'active'
    themeContentReady.value = !!theme?.contentReady
    saveSession()
  }

  function setStudentSession(user) {
    isLoggedIn.value = true
    currentRole.value = 'student'
    currentUserPhone.value = user.phone
    currentEnterpriseId.value = ''
    refreshProfileFromDb()
  }

  function setOrgSession(enterprise) {
    isLoggedIn.value = true
    currentRole.value = 'org'
    currentUserPhone.value = enterprise.contactPhone
    currentEnterpriseId.value = enterprise.id
    refreshProfileFromDb()
  }

  function setPlatformSession() {
    isLoggedIn.value = true
    currentRole.value = 'platform'
    currentUserPhone.value = PLATFORM_ACCOUNT.phone
    currentEnterpriseId.value = ''
    refreshProfileFromDb()
  }

  function registerStudent({ phone, password, nickname: nick }) {
    seedPrdData()

    if (getUserByPhone(phone)) return { success: false, msg: '该手机号已注册' }
    if ((password || '').length < 6) return { success: false, msg: '密码至少需要 6 位' }
    if (!(nick || '').trim()) return { success: false, msg: '请填写学生昵称' }

    const user = createStudentUser({
      phone: phone.trim(),
      password,
      nickname: nick.trim(),
    })

    setStudentSession(user)
    return { success: true }
  }

  function loginStudent({ phone, password }) {
    const user = getUserByPhone((phone || '').trim())
    if (!user || user.role !== 'student' || user.password !== password) {
      return { success: false, msg: '手机号或密码错误' }
    }

    setStudentSession(user)
    return { success: true }
  }

  function registerOrg({ enterpriseName, contactName, contactPhone, password }) {
    seedPrdData()

    const enterprises = getPrdEnterprises()
    if (findEnterpriseByPhone(contactPhone.trim(), enterprises)) {
      return { success: false, msg: '该手机号已注册机构账号' }
    }
    if ((password || '').length < 6) return { success: false, msg: '密码至少需要 6 位' }
    if (!(enterpriseName || '').trim() || !(contactName || '').trim()) {
      return { success: false, msg: '请填写完整机构信息' }
    }

    createEnterpriseRecord({
      enterpriseName: enterpriseName.trim(),
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      password,
    })

    return { success: true, msg: '注册申请已提交，需等待平台开通后登录' }
  }

  function loginOrg({ phone, password }) {
    const enterprise = findEnterpriseByPhone((phone || '').trim())
    if (!enterprise || enterprise.password !== password) {
      return { success: false, msg: '手机号或密码错误' }
    }

    if (enterprise.status === 'pending_review') return { success: false, msg: '机构账号审核中，请等待平台开通' }
    if (enterprise.status === 'disabled') return { success: false, msg: '机构账号已停用，请联系平台运营' }
    if (enterprise.status !== 'opened') return { success: false, msg: '当前机构状态不可登录' }

    setOrgSession(enterprise)
    return { success: true }
  }

  function loginPlatform({ phone, password }) {
    if (phone !== PLATFORM_ACCOUNT.phone || password !== PLATFORM_ACCOUNT.password) {
      return { success: false, msg: '平台账号或密码错误' }
    }

    setPlatformSession()
    return { success: true }
  }

  function logout() {
    isLoggedIn.value = false
    currentRole.value = 'student'
    currentUserPhone.value = ''
    currentEnterpriseId.value = ''
    nickname.value = ''
    inviteCode.value = ''
    teamName.value = ''
    orgName.value = ''
    currentTheme.value = 'moon'
    currentThemeName.value = ''
    currentSeasonName.value = ''
    accountStatus.value = ''
    themeContentReady.value = false
    clearSessionStorage()
  }

  function setRole(role) {
    currentRole.value = role
    saveSession()
  }

  function setTheme(theme) {
    currentTheme.value = theme
    saveSession()
  }

  function setNickname(name) {
    nickname.value = name
    saveSession()
  }

  refreshProfileFromDb()

  return {
    isLoggedIn,
    currentRole,
    currentUserPhone,
    currentEnterpriseId,
    nickname,
    ageGroup,
    inviteCode,
    teamName,
    orgName,
    currentTheme,
    currentThemeName,
    currentSeasonName,
    accountStatus,
    themeContentReady,
    roleLabel,
    themeData,
    registerStudent,
    loginStudent,
    registerOrg,
    loginOrg,
    loginPlatform,
    refreshProfileFromDb,
    logout,
    setRole,
    setTheme,
    setNickname,
  }
})
