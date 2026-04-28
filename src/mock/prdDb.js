export const STORAGE_KEYS = {
  users: 'pook_prd_users',
  enterprises: 'pook_prd_enterprises',
  seasons: 'pook_prd_seasons',
  themes: 'pook_prd_themes',
  invites: 'pook_prd_invites',
  applications: 'pook_prd_applications',
  bindings: 'pook_prd_bindings',
  teams: 'pook_prd_teams',
}

export const PLATFORM_ACCOUNT = {
  phone: '13700000001',
  password: '123456',
  nickname: '平台运营',
}

export const DEMO_THEME_IDS = {
  moon: 'theme_moon_2026',
  mars: 'theme_mars_2026',
}

function canUseStorage() {
  return typeof localStorage !== 'undefined'
}

function readList(key) {
  if (!canUseStorage()) return []
  return JSON.parse(localStorage.getItem(key) || '[]')
}

function writeList(key, value) {
  if (!canUseStorage()) return
  localStorage.setItem(key, JSON.stringify(value))
}

function nowIso() {
  return new Date().toISOString()
}

function nextId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function defaultSeasons() {
  return [
    {
      id: 'season_2025',
      name: '2025 星际源力赛季',
      startTime: '2025-06-01T00:00:00.000Z',
      endTime: '2026-03-01T23:59:59.000Z',
      lockTime: '2026-01-15T23:59:59.000Z',
      status: 'archived',
    },
    {
      id: 'season_2026',
      name: '2026 星际源力赛季',
      startTime: '2026-04-01T00:00:00.000Z',
      endTime: '2027-02-28T23:59:59.000Z',
      lockTime: '2027-01-15T23:59:59.000Z',
      status: 'active',
    },
  ]
}

function defaultThemes() {
  return [
    {
      id: DEMO_THEME_IDS.moon,
      seasonId: 'season_2026',
      code: 'MOON',
      themeKey: 'moon',
      themeName: '月球行动·基础主题',
      difficultyLevel: '基础',
      startTime: '2026-04-01T00:00:00.000Z',
      endTime: '2027-02-28T23:59:59.000Z',
      lockTime: '2027-01-15T23:59:59.000Z',
      status: 'active',
      contentReady: true,
    },
    {
      id: DEMO_THEME_IDS.mars,
      seasonId: 'season_2026',
      code: 'MARS',
      themeKey: 'mars',
      themeName: '火星探索·进阶主题',
      difficultyLevel: '进阶',
      startTime: '2026-04-01T00:00:00.000Z',
      endTime: '2027-02-28T23:59:59.000Z',
      lockTime: '2027-01-15T23:59:59.000Z',
      status: 'active',
      contentReady: true,
    },
  ]
}

function migrateThemeContentReady() {
  const contentReadyByThemeKey = {
    moon: true,
    mars: true,
  }

  const themes = readList(STORAGE_KEYS.themes)
  let changed = false

  const nextThemes = themes.map((theme) => {
    const expectedReady = contentReadyByThemeKey[theme.themeKey]
    if (expectedReady === undefined || theme.contentReady === expectedReady) return theme

    changed = true
    return {
      ...theme,
      contentReady: expectedReady,
    }
  })

  if (changed) writeList(STORAGE_KEYS.themes, nextThemes)
}

function defaultEnterprises() {
  return [
    {
      id: 'ent_stellar',
      enterpriseName: '星辰教育',
      contactName: '林老师',
      contactPhone: '13900000001',
      password: '123456',
      status: 'opened',
      totalQuota: 36,
      createdAt: '2026-04-08T08:00:00.000Z',
      openedAt: '2026-04-10T08:00:00.000Z',
      openedThemeIds: [DEMO_THEME_IDS.moon, DEMO_THEME_IDS.mars],
    },
    {
      id: 'ent_future',
      enterpriseName: '未来科学院',
      contactName: '顾老师',
      contactPhone: '13900000002',
      password: '123456',
      status: 'pending_review',
      totalQuota: 20,
      createdAt: '2026-04-12T10:00:00.000Z',
      openedAt: null,
      openedThemeIds: [],
    },
    {
      id: 'ent_maker',
      enterpriseName: '创客工坊',
      contactName: '赵老师',
      contactPhone: '13900000003',
      password: '123456',
      status: 'opened',
      totalQuota: 18,
      createdAt: '2026-04-06T10:00:00.000Z',
      openedAt: '2026-04-09T08:00:00.000Z',
      openedThemeIds: [DEMO_THEME_IDS.mars],
    },
  ]
}

function defaultUsers() {
  return [
    {
      id: 'user_demo_student',
      phone: '13800000001',
      password: '123456',
      nickname: '小探索家',
      role: 'student',
      registeredAt: '2026-04-10T08:00:00.000Z',
      status: 'active',
    },
    {
      id: 'user_demo_pending',
      phone: '13800000002',
      password: '123456',
      nickname: '林一',
      role: 'student',
      registeredAt: '2026-04-11T08:00:00.000Z',
      status: 'active',
    },
    {
      id: 'user_demo_rejected',
      phone: '13800000003',
      password: '123456',
      nickname: '舟舟',
      role: 'student',
      registeredAt: '2026-04-11T09:00:00.000Z',
      status: 'active',
    },
    {
      id: 'user_demo_mars',
      phone: '13800000006',
      password: '123456',
      nickname: '星野',
      role: 'student',
      registeredAt: '2026-04-12T09:00:00.000Z',
      status: 'active',
    },
    {
      id: 'user_demo_team',
      phone: '13800000005',
      password: '123456',
      nickname: '若谷',
      role: 'student',
      registeredAt: '2026-04-12T08:00:00.000Z',
      status: 'active',
    },
  ]
}

function defaultInvites() {
  return [
    {
      id: 'invite_moon_1001',
      inviteCode: 'MOON1001',
      enterpriseId: 'ent_stellar',
      themeId: DEMO_THEME_IDS.moon,
      seasonId: 'season_2026',
      generatedType: 'platform_seed',
      status: 'bound_active',
      bindUserPhone: '13800000001',
      bindTime: '2026-04-10T08:20:00.000Z',
      expireTime: '2027-02-28T23:59:59.000Z',
      isHistoryReserved: true,
    },
    {
      id: 'invite_moon_1002',
      inviteCode: 'MOON1002',
      enterpriseId: 'ent_stellar',
      themeId: DEMO_THEME_IDS.moon,
      seasonId: 'season_2026',
      generatedType: 'org_manual',
      status: 'unused',
      bindUserPhone: '',
      bindTime: '',
      expireTime: '2027-02-28T23:59:59.000Z',
      isHistoryReserved: true,
    },
    {
      id: 'invite_mars_1001',
      inviteCode: 'MARS1001',
      enterpriseId: 'ent_stellar',
      themeId: DEMO_THEME_IDS.mars,
      seasonId: 'season_2026',
      generatedType: 'org_manual',
      status: 'unused',
      bindUserPhone: '',
      bindTime: '',
      expireTime: '2027-02-28T23:59:59.000Z',
      isHistoryReserved: true,
    },
    {
      id: 'invite_mars_demo_2001',
      inviteCode: 'MARS2001',
      enterpriseId: 'ent_stellar',
      themeId: DEMO_THEME_IDS.mars,
      seasonId: 'season_2026',
      generatedType: 'platform_seed',
      status: 'bound_active',
      bindUserPhone: '13800000006',
      bindTime: '2026-04-12T09:20:00.000Z',
      expireTime: '2027-02-28T23:59:59.000Z',
      isHistoryReserved: true,
    },
  ]
}

function defaultApplications() {
  return [
    {
      id: 'apply_pending_001',
      userPhone: '13800000002',
      studentName: '林一',
      targetEnterpriseId: 'ent_stellar',
      targetThemeId: DEMO_THEME_IDS.moon,
      seasonId: 'season_2026',
      status: 'pending',
      appliedAt: '2026-04-14T09:00:00.000Z',
      auditedAt: '',
      auditedBy: '',
      rejectReason: '',
      assignedInviteCode: '',
      bindingId: '',
    },
    {
      id: 'apply_rejected_001',
      userPhone: '13800000003',
      studentName: '舟舟',
      targetEnterpriseId: 'ent_stellar',
      targetThemeId: DEMO_THEME_IDS.mars,
      seasonId: 'season_2026',
      status: 'rejected',
      appliedAt: '2026-04-13T08:00:00.000Z',
      auditedAt: '2026-04-13T12:00:00.000Z',
      auditedBy: 'ent_stellar',
      rejectReason: '当前主题名额优先保留给线下集训学员',
      assignedInviteCode: '',
      bindingId: '',
    },
  ]
}

function defaultBindings() {
  return [
    {
      id: 'binding_active_001',
      userPhone: '13800000001',
      userNickname: '小探索家',
      enterpriseId: 'ent_stellar',
      enterpriseName: '星辰教育',
      themeId: DEMO_THEME_IDS.moon,
      themeName: '月球行动·基础主题',
      themeKey: 'moon',
      seasonId: 'season_2026',
      seasonName: '2026 星际源力赛季',
      inviteCode: 'MOON1001',
      status: 'effective',
      startTime: '2026-04-10T08:20:00.000Z',
      endTime: '',
      isCurrentEffective: true,
    },
    {
      id: 'binding_active_mars_demo',
      userPhone: '13800000006',
      userNickname: '星野',
      enterpriseId: 'ent_stellar',
      enterpriseName: '星辰教育',
      themeId: DEMO_THEME_IDS.mars,
      themeName: '火星探索·进阶主题',
      themeKey: 'mars',
      seasonId: 'season_2026',
      seasonName: '2026 星际源力赛季',
      inviteCode: 'MARS2001',
      status: 'effective',
      startTime: '2026-04-12T09:20:00.000Z',
      endTime: '',
      isCurrentEffective: true,
    },
    {
      id: 'binding_active_003',
      userPhone: '13800000005',
      userNickname: '若谷',
      enterpriseId: 'ent_stellar',
      enterpriseName: '星辰教育',
      themeId: DEMO_THEME_IDS.moon,
      themeName: '月球行动·基础主题',
      themeKey: 'moon',
      seasonId: 'season_2026',
      seasonName: '2026 星际源力赛季',
      inviteCode: 'MOONX205',
      status: 'effective',
      startTime: '2026-04-12T08:20:00.000Z',
      endTime: '',
      isCurrentEffective: true,
    },
  ]
}

function defaultTeams() {
  return [
    {
      id: 'team_moon_001',
      teamName: '月球先锋1队',
      enterpriseId: 'ent_stellar',
      themeId: DEMO_THEME_IDS.moon,
      seasonId: 'season_2026',
      captainPhone: '13800000001',
      memberPhones: ['13800000001'],
      status: 'forming',
      createdAt: '2026-04-10T09:00:00.000Z',
      lockedAt: '',
      isHistory: false,
    },
    {
      id: 'team_moon_002',
      teamName: '轨道实验队',
      enterpriseId: 'ent_stellar',
      themeId: DEMO_THEME_IDS.moon,
      seasonId: 'season_2026',
      captainPhone: '13800000005',
      memberPhones: ['13800000005'],
      status: 'forming',
      createdAt: '2026-04-12T10:00:00.000Z',
      lockedAt: '',
      isHistory: false,
    },
  ]
}

function migrateThemeSet() {
  const legacyRobotThemeId = 'theme_robot_2026'

  const themes = readList(STORAGE_KEYS.themes)
  const enterprises = readList(STORAGE_KEYS.enterprises)
  const users = readList(STORAGE_KEYS.users)
  const invites = readList(STORAGE_KEYS.invites)
  const applications = readList(STORAGE_KEYS.applications)
  const bindings = readList(STORAGE_KEYS.bindings)
  const teams = readList(STORAGE_KEYS.teams)

  writeList(
    STORAGE_KEYS.themes,
    themes.filter((item) => item.id !== legacyRobotThemeId && item.themeKey !== 'robot'),
  )

  writeList(
    STORAGE_KEYS.enterprises,
    enterprises.map((item) => ({
      ...item,
      openedThemeIds: (item.openedThemeIds || []).filter((themeId) => themeId !== legacyRobotThemeId),
    })),
  )

  writeList(
    STORAGE_KEYS.users,
    users.filter((item) => item.id !== 'user_demo_robot'),
  )

  writeList(
    STORAGE_KEYS.invites,
    invites.filter((item) => item.themeId !== legacyRobotThemeId && !String(item.inviteCode || '').startsWith('ROBO')),
  )

  writeList(
    STORAGE_KEYS.applications,
    applications.filter((item) => item.targetThemeId !== legacyRobotThemeId),
  )

  writeList(
    STORAGE_KEYS.bindings,
    bindings.filter((item) => item.themeId !== legacyRobotThemeId && item.themeKey !== 'robot'),
  )

  writeList(
    STORAGE_KEYS.teams,
    teams.filter((item) => item.themeId !== legacyRobotThemeId && item.id !== 'team_history_001'),
  )
}

function migrateStudentDemoAccounts() {
  const users = readList(STORAGE_KEYS.users)
  const invites = readList(STORAGE_KEYS.invites)
  const bindings = readList(STORAGE_KEYS.bindings)

  const hasMarsDemoUser = users.some((item) => item.phone === '13800000006')
  if (!hasMarsDemoUser) {
    users.push({
      id: 'user_demo_mars',
      phone: '13800000006',
      password: '123456',
      nickname: '星野',
      role: 'student',
      registeredAt: '2026-04-12T09:00:00.000Z',
      status: 'active',
    })
  }

  const hasMarsDemoInvite = invites.some((item) => item.inviteCode === 'MARS2001')
  if (!hasMarsDemoInvite) {
    invites.push({
      id: 'invite_mars_demo_2001',
      inviteCode: 'MARS2001',
      enterpriseId: 'ent_stellar',
      themeId: DEMO_THEME_IDS.mars,
      seasonId: 'season_2026',
      generatedType: 'platform_seed',
      status: 'bound_active',
      bindUserPhone: '13800000006',
      bindTime: '2026-04-12T09:20:00.000Z',
      expireTime: '2027-02-28T23:59:59.000Z',
      isHistoryReserved: true,
    })
  }

  const hasMarsDemoBinding = bindings.some(
    (item) =>
      item.userPhone === '13800000006' &&
      item.themeId === DEMO_THEME_IDS.mars &&
      item.isCurrentEffective,
  )
  if (!hasMarsDemoBinding) {
    bindings.push({
      id: 'binding_active_mars_demo',
      userPhone: '13800000006',
      userNickname: '星野',
      enterpriseId: 'ent_stellar',
      enterpriseName: '星辰教育',
      themeId: DEMO_THEME_IDS.mars,
      themeName: '火星探索·进阶主题',
      themeKey: 'mars',
      seasonId: 'season_2026',
      seasonName: '2026 星际源力赛季',
      inviteCode: 'MARS2001',
      status: 'effective',
      startTime: '2026-04-12T09:20:00.000Z',
      endTime: '',
      isCurrentEffective: true,
    })
  }

  writeList(STORAGE_KEYS.users, users)
  writeList(STORAGE_KEYS.invites, invites)
  writeList(STORAGE_KEYS.bindings, bindings)
}

export function seedPrdData() {
  if (!canUseStorage()) return

  if (!localStorage.getItem(STORAGE_KEYS.seasons)) writeList(STORAGE_KEYS.seasons, defaultSeasons())
  if (!localStorage.getItem(STORAGE_KEYS.themes)) writeList(STORAGE_KEYS.themes, defaultThemes())
  if (!localStorage.getItem(STORAGE_KEYS.enterprises)) writeList(STORAGE_KEYS.enterprises, defaultEnterprises())
  if (!localStorage.getItem(STORAGE_KEYS.users)) writeList(STORAGE_KEYS.users, defaultUsers())
  if (!localStorage.getItem(STORAGE_KEYS.invites)) writeList(STORAGE_KEYS.invites, defaultInvites())
  if (!localStorage.getItem(STORAGE_KEYS.applications)) writeList(STORAGE_KEYS.applications, defaultApplications())
  if (!localStorage.getItem(STORAGE_KEYS.bindings)) writeList(STORAGE_KEYS.bindings, defaultBindings())
  if (!localStorage.getItem(STORAGE_KEYS.teams)) writeList(STORAGE_KEYS.teams, defaultTeams())

  migrateThemeSet()
  migrateThemeContentReady()
  migrateStudentDemoAccounts()
}

export function getPrdUsers() {
  seedPrdData()
  return readList(STORAGE_KEYS.users)
}

export function savePrdUsers(users) {
  writeList(STORAGE_KEYS.users, users)
}

export function getPrdEnterprises() {
  seedPrdData()
  return readList(STORAGE_KEYS.enterprises)
}

export function savePrdEnterprises(enterprises) {
  writeList(STORAGE_KEYS.enterprises, enterprises)
}

export function getPrdSeasons() {
  seedPrdData()
  return readList(STORAGE_KEYS.seasons)
}

export function savePrdSeasons(seasons) {
  writeList(STORAGE_KEYS.seasons, seasons)
}

export function getPrdThemes() {
  seedPrdData()
  return readList(STORAGE_KEYS.themes)
}

export function savePrdThemes(themes) {
  writeList(STORAGE_KEYS.themes, themes)
}

export function getPrdInvites() {
  seedPrdData()
  return readList(STORAGE_KEYS.invites)
}

export function savePrdInvites(invites) {
  writeList(STORAGE_KEYS.invites, invites)
}

export function getPrdApplications() {
  seedPrdData()
  return readList(STORAGE_KEYS.applications)
}

export function savePrdApplications(applications) {
  writeList(STORAGE_KEYS.applications, applications)
}

export function getPrdBindings() {
  seedPrdData()
  return readList(STORAGE_KEYS.bindings)
}

export function savePrdBindings(bindings) {
  writeList(STORAGE_KEYS.bindings, bindings)
}

export function getPrdTeams() {
  seedPrdData()
  return readList(STORAGE_KEYS.teams)
}

export function savePrdTeams(teams) {
  writeList(STORAGE_KEYS.teams, teams)
}

export function getCurrentSeason(seasons = getPrdSeasons()) {
  return seasons.find((season) => season.status === 'active') || seasons[0] || null
}

export function getThemeById(themeId, themes = getPrdThemes()) {
  return themes.find((theme) => theme.id === themeId) || null
}

export function getEnterpriseById(enterpriseId, enterprises = getPrdEnterprises()) {
  return enterprises.find((enterprise) => enterprise.id === enterpriseId) || null
}

export function getUserByPhone(phone, users = getPrdUsers()) {
  return users.find((user) => user.phone === phone) || null
}

export function getInviteByCode(code, invites = getPrdInvites()) {
  const normalized = (code || '').trim().toUpperCase().replace(/[-\s]/g, '')
  return invites.find((invite) => invite.inviteCode === normalized) || null
}

export function getInviteInfo(code, invites = getPrdInvites(), enterprises = getPrdEnterprises(), themes = getPrdThemes()) {
  const invite = getInviteByCode(code, invites)
  if (!invite) return null
  const enterprise = getEnterpriseById(invite.enterpriseId, enterprises)
  const theme = getThemeById(invite.themeId, themes)
  return {
    ...invite,
    orgName: enterprise?.enterpriseName || '',
    themeName: theme?.themeName || '',
    themeKey: theme?.themeKey || 'moon',
    contentReady: !!theme?.contentReady,
  }
}

export function getEffectiveBinding(userPhone, seasonId = getCurrentSeason()?.id, bindings = getPrdBindings()) {
  return bindings.find(
    (binding) => binding.userPhone === userPhone &&
      binding.seasonId === seasonId &&
      binding.status === 'effective' &&
      binding.isCurrentEffective
  ) || null
}

export function hasEffectiveBinding(userPhone, seasonId = getCurrentSeason()?.id) {
  return !!getEffectiveBinding(userPhone, seasonId)
}

export function getActiveTeamForUser(userPhone, seasonId = getCurrentSeason()?.id, teams = getPrdTeams()) {
  return teams.find(
    (team) => team.seasonId === seasonId &&
      !team.isHistory &&
      ['forming', 'full', 'locked'].includes(team.status) &&
      team.memberPhones.includes(userPhone)
  ) || null
}

export function getEnterpriseActiveCount(enterpriseId, seasonId = getCurrentSeason()?.id, bindings = getPrdBindings()) {
  return bindings.filter(
    (binding) => binding.enterpriseId === enterpriseId &&
      binding.seasonId === seasonId &&
      binding.status === 'effective' &&
      binding.isCurrentEffective
  ).length
}

export function generateInviteCode(prefix, invites = getPrdInvites()) {
  const normalizedPrefix = (prefix || 'CODE').toUpperCase().slice(0, 4)
  const used = new Set(invites.map((invite) => invite.inviteCode))
  let candidate = ''
  do {
    candidate = `${normalizedPrefix}${Math.floor(1000 + Math.random() * 9000)}`
  } while (used.has(candidate))
  return candidate
}

export function createStudentUser({ phone, password, nickname }) {
  const users = getPrdUsers()
  const user = {
    id: nextId('user'),
    phone,
    password,
    nickname,
    role: 'student',
    registeredAt: nowIso(),
    status: 'active',
  }
  users.push(user)
  savePrdUsers(users)
  return user
}

export function createEnterpriseRecord({ enterpriseName, contactName, contactPhone, password }) {
  const enterprises = getPrdEnterprises()
  const enterprise = {
    id: nextId('ent'),
    enterpriseName,
    contactName,
    contactPhone,
    password,
    status: 'pending_review',
    totalQuota: 12,
    createdAt: nowIso(),
    openedAt: null,
    openedThemeIds: [],
  }
  enterprises.push(enterprise)
  savePrdEnterprises(enterprises)
  return enterprise
}
