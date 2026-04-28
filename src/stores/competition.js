import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user.js'
import { themeInfo } from '@/mock/inviteCodes.js'
import {
  generateInviteCode,
  getActiveTeamForUser,
  getCurrentSeason,
  getEffectiveBinding,
  getEnterpriseActiveCount,
  getEnterpriseById,
  getPrdApplications,
  getPrdBindings,
  getPrdEnterprises,
  getPrdInvites,
  getPrdSeasons,
  getPrdTeams,
  getPrdThemes,
  getThemeById,
  getUserByPhone,
  savePrdApplications,
  savePrdBindings,
  savePrdEnterprises,
  savePrdInvites,
  savePrdTeams,
  seedPrdData,
} from '@/mock/prdDb.js'

function nowIso() {
  return new Date().toISOString()
}

function nextId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function sortDescBy(field) {
  return (a, b) => new Date(b[field] || 0).getTime() - new Date(a[field] || 0).getTime()
}

function clampCount(value, fallback = 3) {
  const count = Number(value)
  if (!Number.isFinite(count)) return fallback
  return Math.max(1, Math.min(20, Math.floor(count)))
}

export const useCompetitionStore = defineStore('competition', () => {
  const userStore = useUserStore()

  const seasons = ref([])
  const themes = ref([])
  const enterprises = ref([])
  const invites = ref([])
  const applications = ref([])
  const bindings = ref([])
  const teams = ref([])

  function refresh() {
    seedPrdData()
    seasons.value = getPrdSeasons()
    themes.value = getPrdThemes()
    enterprises.value = getPrdEnterprises()
    invites.value = getPrdInvites()
    applications.value = getPrdApplications()
    bindings.value = getPrdBindings()
    teams.value = getPrdTeams()
  }

  refresh()

  const currentSeason = computed(() => getCurrentSeason(seasons.value))
  const currentSeasonId = computed(() => currentSeason.value?.id || '')

  const themeList = computed(() =>
    themes.value.map((theme) => ({
      ...theme,
      visual: themeInfo[theme.themeKey] || themeInfo.moon,
    })),
  )

  function themeVisual(themeKey) {
    return themeInfo[themeKey] || themeInfo.moon
  }

  function enrichTheme(theme) {
    if (!theme) return null
    return {
      ...theme,
      visual: themeVisual(theme.themeKey),
    }
  }

  function enrichEnterprise(enterprise) {
    if (!enterprise) return null

    const activeCount = getEnterpriseActiveCount(enterprise.id, currentSeasonId.value, bindings.value)
    const pendingCount = applications.value.filter(
      (item) => item.targetEnterpriseId === enterprise.id && item.status === 'pending',
    ).length

    return {
      ...enterprise,
      activeCount,
      pendingCount,
      remainingQuota: Math.max(enterprise.totalQuota - activeCount, 0),
      openedThemes: enterprise.openedThemeIds
        .map((themeId) => getThemeById(themeId, themes.value))
        .filter(Boolean)
        .map(enrichTheme),
    }
  }

  function enrichApplication(application) {
    const enterprise = getEnterpriseById(application.targetEnterpriseId, enterprises.value)
    const theme = getThemeById(application.targetThemeId, themes.value)
    return {
      ...application,
      enterpriseName: enterprise?.enterpriseName || '未匹配机构',
      themeName: theme?.themeName || '未匹配主题',
      themeKey: theme?.themeKey || 'moon',
      visual: themeVisual(theme?.themeKey || 'moon'),
    }
  }

  function enrichBinding(binding) {
    const theme = getThemeById(binding.themeId, themes.value)
    return {
      ...binding,
      visual: themeVisual(binding.themeKey || theme?.themeKey || 'moon'),
      contentReady: !!theme?.contentReady,
    }
  }

  function enrichInvite(invite) {
    const enterprise = getEnterpriseById(invite.enterpriseId, enterprises.value)
    const theme = getThemeById(invite.themeId, themes.value)
    const student = invite.bindUserPhone ? getUserByPhone(invite.bindUserPhone) : null
    const stateMap = {
      unused: { label: '未绑定', tone: 'neutral' },
      bound_active: { label: '已绑定', tone: 'positive' },
      invalidated: { label: '已失效', tone: 'danger' },
    }
    const state = stateMap[invite.status] || { label: '已失效', tone: 'danger' }
    return {
      ...invite,
      enterpriseName: enterprise?.enterpriseName || '未匹配机构',
      themeName: theme?.themeName || '未匹配主题',
      themeKey: theme?.themeKey || 'moon',
      visual: themeVisual(theme?.themeKey || 'moon'),
      studentName: student?.nickname || '',
      studentPhone: invite.bindUserPhone || '',
      statusLabel: state.label,
      statusTone: state.tone,
      canUnbind: invite.status === 'bound_active' && !!invite.bindUserPhone,
    }
  }

  function enrichTeam(team) {
    const enterprise = getEnterpriseById(team.enterpriseId, enterprises.value)
    const theme = getThemeById(team.themeId, themes.value)
    return {
      ...team,
      enterpriseName: enterprise?.enterpriseName || '未匹配机构',
      themeName: theme?.themeName || '未匹配主题',
      themeKey: theme?.themeKey || 'moon',
      visual: themeVisual(theme?.themeKey || 'moon'),
      memberNames: team.memberPhones
        .map((phone) => getUserByPhone(phone))
        .filter(Boolean)
        .map((user) => ({ phone: user.phone, nickname: user.nickname })),
    }
  }

  const studentBinding = computed(() => {
    if (!userStore.currentUserPhone) return null
    const binding = getEffectiveBinding(userStore.currentUserPhone, currentSeasonId.value, bindings.value)
    return binding ? enrichBinding(binding) : null
  })

  const studentTeam = computed(() => {
    if (!userStore.currentUserPhone) return null
    const team = getActiveTeamForUser(userStore.currentUserPhone, currentSeasonId.value, teams.value)
    return team ? enrichTeam(team) : null
  })

  const studentApplications = computed(() =>
    applications.value
      .filter((item) => item.userPhone === userStore.currentUserPhone)
      .map(enrichApplication)
      .sort(sortDescBy('appliedAt')),
  )

  const studentHistoryBindings = computed(() =>
    bindings.value
      .filter((item) => item.userPhone === userStore.currentUserPhone && !item.isCurrentEffective)
      .map(enrichBinding)
      .sort(sortDescBy('startTime')),
  )

  const studentAvailableThemes = computed(() =>
    themeList.value.filter((item) => item.status === 'active' && item.seasonId === currentSeasonId.value),
  )

  const studentAvailableEnterprises = computed(() =>
    enterprises.value
      .filter((enterprise) => enterprise.status === 'opened')
      .map(enrichEnterprise)
      .sort((a, b) => a.enterpriseName.localeCompare(b.enterpriseName)),
  )

  const studentAvailableTeams = computed(() => {
    if (!studentBinding.value) return []

    return teams.value
      .filter(
        (team) =>
          team.enterpriseId === studentBinding.value.enterpriseId &&
          team.themeId === studentBinding.value.themeId &&
          team.seasonId === studentBinding.value.seasonId &&
          !team.isHistory,
      )
      .map(enrichTeam)
      .sort(sortDescBy('createdAt'))
  })

  const orgEnterpriseRaw = computed(() =>
    getEnterpriseById(userStore.currentEnterpriseId, enterprises.value) ||
    enterprises.value.find((enterprise) => enterprise.contactPhone === userStore.currentUserPhone) ||
    null,
  )

  const orgEnterprise = computed(() => enrichEnterprise(orgEnterpriseRaw.value))

  const orgApplications = computed(() => {
    if (!orgEnterprise.value) return []
    return applications.value
      .filter((item) => item.targetEnterpriseId === orgEnterprise.value.id)
      .map(enrichApplication)
      .sort(sortDescBy('appliedAt'))
  })

  const orgPendingApplications = computed(() =>
    orgApplications.value.filter((item) => item.status === 'pending'),
  )

  const orgBindings = computed(() => {
    if (!orgEnterprise.value) return []
    return bindings.value
      .filter((item) => item.enterpriseId === orgEnterprise.value.id)
      .map(enrichBinding)
      .sort(sortDescBy('startTime'))
  })

  const orgInvites = computed(() => {
    if (!orgEnterprise.value) return []
    return invites.value
      .filter((item) => item.enterpriseId === orgEnterprise.value.id)
      .map(enrichInvite)
      .sort(sortDescBy('bindTime'))
  })

  const orgTeams = computed(() => {
    if (!orgEnterprise.value) return []
    return teams.value
      .filter((item) => item.enterpriseId === orgEnterprise.value.id && !item.isHistory)
      .map(enrichTeam)
      .sort(sortDescBy('createdAt'))
  })

  const orgHistoryTeams = computed(() => {
    if (!orgEnterprise.value) return []
    return teams.value
      .filter((item) => item.enterpriseId === orgEnterprise.value.id && item.isHistory)
      .map(enrichTeam)
      .sort(sortDescBy('createdAt'))
  })

  const orgMetrics = computed(() => ({
    totalQuota: orgEnterprise.value?.totalQuota || 0,
    activeStudents: orgEnterprise.value?.activeCount || 0,
    remainingQuota: orgEnterprise.value?.remainingQuota || 0,
    pendingApplications: orgPendingApplications.value.length,
    unusedInvites: orgInvites.value.filter((item) => item.status === 'unused').length,
    lockedTeams: orgTeams.value.filter((item) => item.status === 'locked').length,
  }))

  const platformEnterprises = computed(() =>
    enterprises.value
      .map(enrichEnterprise)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()),
  )

  const platformApplications = computed(() =>
    applications.value.map(enrichApplication).sort(sortDescBy('appliedAt')),
  )

  const platformInvites = computed(() =>
    invites.value.map(enrichInvite).sort(sortDescBy('bindTime')),
  )

  const platformBindings = computed(() =>
    bindings.value.map(enrichBinding).sort(sortDescBy('startTime')),
  )

  const platformTeams = computed(() =>
    teams.value.map(enrichTeam).sort(sortDescBy('createdAt')),
  )

  const platformMetrics = computed(() => ({
    enterpriseCount: enterprises.value.length,
    openedEnterpriseCount: enterprises.value.filter((item) => item.status === 'opened').length,
    pendingEnterpriseCount: enterprises.value.filter((item) => item.status === 'pending_review').length,
    effectiveBindingCount: bindings.value.filter((item) => item.isCurrentEffective).length,
    pendingApplicationCount: applications.value.filter((item) => item.status === 'pending').length,
    inviteCount: invites.value.length,
  }))

  function ensureStudent() {
    if (userStore.currentRole !== 'student' || !userStore.currentUserPhone) {
      return { success: false, msg: '请先使用学生账号登录' }
    }
    return null
  }

  function ensureOrg() {
    if (userStore.currentRole !== 'org' || !orgEnterpriseRaw.value) {
      return { success: false, msg: '请先使用机构账号登录' }
    }
    return null
  }

  function ensurePlatform() {
    if (userStore.currentRole !== 'platform') {
      return { success: false, msg: '请先使用平台账号登录' }
    }
    return null
  }

  function submitApplication({ enterpriseId, themeId }) {
    refresh()

    const denied = ensureStudent()
    if (denied) return denied

    const season = currentSeason.value
    const user = getUserByPhone(userStore.currentUserPhone)
    const enterprise = getEnterpriseById(enterpriseId, enterprises.value)
    const theme = getThemeById(themeId, themes.value)

    if (!season || !user) return { success: false, msg: '当前账号信息异常，请重新登录' }
    if (!enterprise || enterprise.status !== 'opened') return { success: false, msg: '目标机构尚未开通' }
    if (!theme || theme.status !== 'active') return { success: false, msg: '主题当前不可申请' }
    if (!enterprise.openedThemeIds.includes(theme.id)) return { success: false, msg: '该机构未开通此赛事主题' }

    const binding = getEffectiveBinding(user.phone, season.id, bindings.value)
    if (binding) return { success: false, msg: '当前赛季已有有效绑定，无法重复申请' }

    const pending = applications.value.find(
      (item) => item.userPhone === user.phone && item.seasonId === season.id && item.status === 'pending',
    )
    if (pending) return { success: false, msg: '你已有待审核申请，请等待机构处理' }

    applications.value.push({
      id: nextId('apply'),
      userPhone: user.phone,
      studentName: user.nickname,
      targetEnterpriseId: enterprise.id,
      targetThemeId: theme.id,
      seasonId: season.id,
      status: 'pending',
      appliedAt: nowIso(),
      auditedAt: '',
      auditedBy: '',
      rejectReason: '',
      assignedInviteCode: '',
      bindingId: '',
    })

    savePrdApplications(applications.value)
    refresh()
    userStore.refreshProfileFromDb()
    return { success: true, msg: '申请已提交，等待机构审核' }
  }

  function bindByInviteCode(code) {
    refresh()

    const denied = ensureStudent()
    if (denied) return denied

    const season = currentSeason.value
    const user = getUserByPhone(userStore.currentUserPhone)
    const normalized = (code || '').trim().toUpperCase().replace(/[-\s]/g, '')
    const invite = invites.value.find((item) => item.inviteCode === normalized)
    const binding = season ? getEffectiveBinding(userStore.currentUserPhone, season.id, bindings.value) : null

    if (!season || !user) return { success: false, msg: '当前账号信息异常，请重新登录' }
    if (binding) return { success: false, msg: '当前赛季已有有效绑定，不能重复绑定' }
    if (!invite) return { success: false, msg: '邀请码不存在或已失效' }
    if (invite.status !== 'unused') return { success: false, msg: '邀请码已被使用' }
    if (invite.seasonId !== season.id) return { success: false, msg: '邀请码不属于当前赛季，不能直接绑定' }

    const enterprise = getEnterpriseById(invite.enterpriseId, enterprises.value)
    const theme = getThemeById(invite.themeId, themes.value)
    if (!enterprise || enterprise.status !== 'opened') return { success: false, msg: '邀请码对应机构尚未开通' }
    if (!theme || theme.status !== 'active') return { success: false, msg: '邀请码对应主题不可用' }
    if (!enterprise.openedThemeIds.includes(theme.id)) return { success: false, msg: '机构尚未开通此赛事主题' }

    const pending = applications.value.find(
      (item) => item.userPhone === user.phone && item.seasonId === season.id && item.status === 'pending',
    )
    if (pending) return { success: false, msg: '你已有待审核申请，请先等待机构处理' }

    const activeCount = getEnterpriseActiveCount(enterprise.id, season.id, bindings.value)
    if (activeCount >= enterprise.totalQuota) {
      return { success: false, msg: '机构当前有效学员名额已满，请联系机构老师' }
    }

    invite.status = 'bound_active'
    invite.bindUserPhone = user.phone
    invite.bindTime = nowIso()

    bindings.value.push({
      id: nextId('binding'),
      userPhone: user.phone,
      userNickname: user.nickname,
      enterpriseId: enterprise.id,
      enterpriseName: enterprise.enterpriseName,
      themeId: theme.id,
      themeName: theme.themeName,
      themeKey: theme.themeKey,
      seasonId: season.id,
      seasonName: season.name,
      inviteCode: invite.inviteCode,
      status: 'effective',
      startTime: invite.bindTime,
      endTime: '',
      isCurrentEffective: true,
    })

    savePrdInvites(invites.value)
    savePrdBindings(bindings.value)
    refresh()
    userStore.refreshProfileFromDb()
    return { success: true, msg: '邀请码绑定成功' }
  }

  function approveApplication(applicationId) {
    refresh()

    const denied = ensureOrg()
    if (denied) return denied

    const application = applications.value.find((item) => item.id === applicationId)
    const season = currentSeason.value
    if (!application || application.status !== 'pending') return { success: false, msg: '申请状态已变更，请刷新页面' }
    if (application.targetEnterpriseId !== orgEnterpriseRaw.value.id) return { success: false, msg: '无权处理该申请' }
    if (application.seasonId !== season.id) return { success: false, msg: '只能处理当前赛季的申请' }
    if (!season) return { success: false, msg: '当前赛季未配置' }

    const user = getUserByPhone(application.userPhone)
    const theme = getThemeById(application.targetThemeId, themes.value)
    if (!user || !theme) return { success: false, msg: '申请数据不完整，无法通过' }
    if (!orgEnterpriseRaw.value.openedThemeIds.includes(theme.id)) return { success: false, msg: '机构尚未开通该主题' }

    const existingBinding = getEffectiveBinding(user.phone, season.id, bindings.value)
    if (existingBinding) return { success: false, msg: '该学生已有有效绑定' }

    const activeCount = getEnterpriseActiveCount(orgEnterpriseRaw.value.id, season.id, bindings.value)
    if (activeCount >= orgEnterpriseRaw.value.totalQuota) {
      return { success: false, msg: '机构有效学员名额已满，无法继续通过' }
    }

    const inviteCode = generateInviteCode(theme.code || theme.themeKey, invites.value)
    const bindTime = nowIso()
    const bindingId = nextId('binding')

    invites.value.push({
      id: nextId('invite'),
      inviteCode,
      enterpriseId: orgEnterpriseRaw.value.id,
      themeId: theme.id,
      seasonId: season.id,
      generatedType: 'application_approval',
      status: 'bound_active',
      bindUserPhone: user.phone,
      bindTime,
      expireTime: season.endTime,
      isHistoryReserved: true,
    })

    bindings.value.push({
      id: bindingId,
      userPhone: user.phone,
      userNickname: user.nickname,
      enterpriseId: orgEnterpriseRaw.value.id,
      enterpriseName: orgEnterpriseRaw.value.enterpriseName,
      themeId: theme.id,
      themeName: theme.themeName,
      themeKey: theme.themeKey,
      seasonId: season.id,
      seasonName: season.name,
      inviteCode,
      status: 'effective',
      startTime: bindTime,
      endTime: '',
      isCurrentEffective: true,
    })

    application.status = 'approved'
    application.auditedAt = bindTime
    application.auditedBy = orgEnterpriseRaw.value.id
    application.rejectReason = ''
    application.assignedInviteCode = inviteCode
    application.bindingId = bindingId

    savePrdInvites(invites.value)
    savePrdBindings(bindings.value)
    savePrdApplications(applications.value)
    refresh()
    userStore.refreshProfileFromDb()
    return { success: true, msg: '申请已通过并完成绑定' }
  }

  function rejectApplication(applicationId, rejectReason = '当前阶段名额优先保留给已排课学员') {
    refresh()

    const denied = ensureOrg()
    if (denied) return denied

    const application = applications.value.find((item) => item.id === applicationId)
    if (!application || application.status !== 'pending') return { success: false, msg: '申请状态已变更，请刷新页面' }
    if (application.targetEnterpriseId !== orgEnterpriseRaw.value.id) return { success: false, msg: '无权处理该申请' }

    application.status = 'rejected'
    application.auditedAt = nowIso()
    application.auditedBy = orgEnterpriseRaw.value.id
    application.rejectReason = rejectReason

    savePrdApplications(applications.value)
    refresh()
    return { success: true, msg: '申请已拒绝' }
  }

  function generateInvites({ themeId, count = 3, enterpriseId = '' }) {
    refresh()

    const season = currentSeason.value
    const normalizedCount = clampCount(count)
    const roleDenied =
      userStore.currentRole === 'platform'
        ? ensurePlatform()
        : ensureOrg()

    if (roleDenied) return roleDenied
    if (!season) return { success: false, msg: '当前赛季未配置' }

    const targetEnterpriseId = userStore.currentRole === 'platform'
      ? enterpriseId
      : orgEnterpriseRaw.value?.id

    const enterprise = getEnterpriseById(targetEnterpriseId, enterprises.value)
    const theme = getThemeById(themeId, themes.value)

    if (!enterprise) return { success: false, msg: '目标机构不存在' }
    if (!theme) return { success: false, msg: '目标主题不存在' }
    if (enterprise.status !== 'opened') return { success: false, msg: '机构尚未开通，不能生成邀请码' }
    if (!enterprise.openedThemeIds.includes(theme.id)) return { success: false, msg: '机构尚未开通此赛事主题' }

    for (let index = 0; index < normalizedCount; index += 1) {
      invites.value.push({
        id: nextId('invite'),
        inviteCode: generateInviteCode(theme.code || theme.themeKey, invites.value),
        enterpriseId: enterprise.id,
        themeId: theme.id,
        seasonId: season.id,
        generatedType: userStore.currentRole === 'platform' ? 'platform_manual' : 'org_manual',
        status: 'unused',
        bindUserPhone: '',
        bindTime: '',
        expireTime: season.endTime,
        isHistoryReserved: true,
      })
    }

    savePrdInvites(invites.value)
    refresh()
    return { success: true, msg: `已生成 ${normalizedCount} 个邀请码` }
  }

  function unbindInvite(inviteId) {
    refresh()

    const denied = ensureOrg()
    if (denied) return denied

    const invite = invites.value.find((item) => item.id === inviteId)
    if (!invite) return { success: false, msg: '邀请码不存在' }
    if (invite.enterpriseId !== orgEnterpriseRaw.value.id) return { success: false, msg: '无权操作该邀请码' }
    if (invite.status !== 'bound_active' || !invite.bindUserPhone) {
      return { success: false, msg: '当前邀请码不可执行解绑' }
    }

    const studentPhone = invite.bindUserPhone
    const unbindTime = nowIso()
    const binding = bindings.value.find(
      (item) =>
        item.enterpriseId === invite.enterpriseId &&
        item.userPhone === studentPhone &&
        item.inviteCode === invite.inviteCode &&
        item.isCurrentEffective,
    )

    if (binding) {
      binding.status = 'withdrawn'
      binding.endTime = unbindTime
      binding.isCurrentEffective = false
    }

    teams.value = teams.value.flatMap((team) => {
      const shouldUpdate =
        !team.isHistory &&
        team.seasonId === invite.seasonId &&
        team.memberPhones.includes(studentPhone)

      if (!shouldUpdate) return [team]

      const memberPhones = team.memberPhones.filter((phone) => phone !== studentPhone)
      if (!memberPhones.length) return []

      return [{
        ...team,
        memberPhones,
        captainPhone: team.captainPhone === studentPhone ? memberPhones[0] : team.captainPhone,
        status: memberPhones.length >= 5 ? 'full' : 'forming',
        lockedAt: '',
      }]
    })

    invite.status = 'invalidated'
    invite.invalidateTime = unbindTime
    invite.invalidReason = 'org_unbind'

    savePrdInvites(invites.value)
    savePrdBindings(bindings.value)
    savePrdTeams(teams.value)
    refresh()
    userStore.refreshProfileFromDb()
    return { success: true, msg: '解绑已生效，邀请码已永久失效' }
  }

  function createTeam(teamName) {
    refresh()

    const denied = ensureStudent()
    if (denied) return denied
    if (!studentBinding.value) return { success: false, msg: '请先完成机构绑定后再组队' }
    if (studentTeam.value) return { success: false, msg: '当前账号已在队伍中' }
    if (!(teamName || '').trim()) return { success: false, msg: '请填写队伍名称' }

    const duplicate = teams.value.find(
      (team) =>
        team.seasonId === studentBinding.value.seasonId &&
        team.enterpriseId === studentBinding.value.enterpriseId &&
        team.themeId === studentBinding.value.themeId &&
        team.teamName === teamName.trim() &&
        !team.isHistory,
    )
    if (duplicate) return { success: false, msg: '同机构同主题下已存在同名队伍' }

    teams.value.push({
      id: nextId('team'),
      teamName: teamName.trim(),
      enterpriseId: studentBinding.value.enterpriseId,
      themeId: studentBinding.value.themeId,
      seasonId: studentBinding.value.seasonId,
      captainPhone: userStore.currentUserPhone,
      memberPhones: [userStore.currentUserPhone],
      status: 'forming',
      createdAt: nowIso(),
      lockedAt: '',
      isHistory: false,
    })

    savePrdTeams(teams.value)
    refresh()
    userStore.refreshProfileFromDb()
    return { success: true, msg: '队伍已创建' }
  }

  function joinTeam(teamId) {
    refresh()

    const denied = ensureStudent()
    if (denied) return denied
    if (!studentBinding.value) return { success: false, msg: '请先完成机构绑定后再组队' }
    if (studentTeam.value) return { success: false, msg: '当前账号已在队伍中' }

    const team = teams.value.find((item) => item.id === teamId && !item.isHistory)
    if (!team) return { success: false, msg: '目标队伍不存在' }
    if (team.status === 'locked') return { success: false, msg: '队伍已锁定，不能加入' }
    if (
      team.enterpriseId !== studentBinding.value.enterpriseId ||
      team.themeId !== studentBinding.value.themeId ||
      team.seasonId !== studentBinding.value.seasonId
    ) {
      return { success: false, msg: '只能加入同机构、同主题、同赛季的队伍' }
    }
    if (team.memberPhones.includes(userStore.currentUserPhone)) {
      return { success: false, msg: '当前账号已在该队伍中' }
    }
    if (team.memberPhones.length >= 5) return { success: false, msg: '队伍人数已满' }

    team.memberPhones.push(userStore.currentUserPhone)
    team.status = team.memberPhones.length >= 5 ? 'full' : 'forming'

    savePrdTeams(teams.value)
    refresh()
    userStore.refreshProfileFromDb()
    return { success: true, msg: '已加入队伍' }
  }

  function leaveTeam(teamId = '') {
    refresh()

    const denied = ensureStudent()
    if (denied) return denied

    const current = teamId
      ? teams.value.find((item) => item.id === teamId)
      : getActiveTeamForUser(userStore.currentUserPhone, currentSeasonId.value, teams.value)

    if (!current) return { success: false, msg: '当前没有可退出的队伍' }
    if (current.status === 'locked') return { success: false, msg: '队伍已锁定，不能退出' }

    current.memberPhones = current.memberPhones.filter((phone) => phone !== userStore.currentUserPhone)

    if (!current.memberPhones.length) {
      teams.value = teams.value.filter((item) => item.id !== current.id)
    } else {
      if (current.captainPhone === userStore.currentUserPhone) {
        current.captainPhone = current.memberPhones[0]
      }
      current.status = current.memberPhones.length >= 5 ? 'full' : 'forming'
    }

    savePrdTeams(teams.value)
    refresh()
    userStore.refreshProfileFromDb()
    return { success: true, msg: '已退出队伍' }
  }

  function lockTeam(teamId = '') {
    refresh()

    const denied = ensureStudent()
    if (denied) return denied

    const current = teamId
      ? teams.value.find((item) => item.id === teamId)
      : getActiveTeamForUser(userStore.currentUserPhone, currentSeasonId.value, teams.value)

    if (!current) return { success: false, msg: '当前没有可锁定的队伍' }
    if (current.captainPhone !== userStore.currentUserPhone) return { success: false, msg: '仅队长可以锁定队伍' }
    if (current.status === 'locked') return { success: false, msg: '队伍已锁定' }
    if (current.memberPhones.length < 1 || current.memberPhones.length > 5) {
      return { success: false, msg: '队伍人数需在 1 到 5 人之间' }
    }

    current.status = 'locked'
    current.lockedAt = nowIso()

    savePrdTeams(teams.value)
    refresh()
    userStore.refreshProfileFromDb()
    return { success: true, msg: '队伍已锁定' }
  }

  function reviewEnterprise(enterpriseId, { status, totalQuota } = {}) {
    refresh()

    const denied = ensurePlatform()
    if (denied) return denied

    const enterprise = enterprises.value.find((item) => item.id === enterpriseId)
    if (!enterprise) return { success: false, msg: '机构不存在' }

    if (typeof totalQuota === 'number' && totalQuota > 0) {
      enterprise.totalQuota = totalQuota
    }

    if (status) {
      enterprise.status = status
      if (status === 'opened' && !enterprise.openedAt) enterprise.openedAt = nowIso()
    }

    savePrdEnterprises(enterprises.value)
    refresh()
    userStore.refreshProfileFromDb()
    return { success: true, msg: '机构状态已更新' }
  }

  function updateEnterpriseQuota(enterpriseId, totalQuota) {
    refresh()

    const normalizedQuota = Number(totalQuota)
    if (!Number.isInteger(normalizedQuota) || normalizedQuota <= 0) {
      return { success: false, msg: '请输入大于 0 的正整数名额' }
    }

    const denied = ensurePlatform()
    if (denied) return denied

    const enterprise = enterprises.value.find((item) => item.id === enterpriseId)
    if (!enterprise) return { success: false, msg: '机构不存在' }

    const activeCount = getEnterpriseActiveCount(enterprise.id, currentSeasonId.value, bindings.value)
    if (normalizedQuota < activeCount) {
      return { success: false, msg: `设置名额不能小于当前有效学员数 ${activeCount}` }
    }

    enterprise.totalQuota = normalizedQuota

    savePrdEnterprises(enterprises.value)
    refresh()
    userStore.refreshProfileFromDb()
    return { success: true, msg: '机构参赛名额已更新' }
  }

  function toggleEnterpriseTheme(enterpriseId, themeId) {
    refresh()

    const denied = ensurePlatform()
    if (denied) return denied

    const enterprise = enterprises.value.find((item) => item.id === enterpriseId)
    if (!enterprise) return { success: false, msg: '机构不存在' }

    if (enterprise.openedThemeIds.includes(themeId)) {
      enterprise.openedThemeIds = enterprise.openedThemeIds.filter((item) => item !== themeId)
    } else {
      enterprise.openedThemeIds = [...enterprise.openedThemeIds, themeId]
    }

    savePrdEnterprises(enterprises.value)
    refresh()
    return { success: true, msg: '机构主题权限已更新' }
  }

  return {
    seasons,
    themes,
    themeList,
    enterprises,
    invites,
    applications,
    bindings,
    teams,
    currentSeason,
    studentBinding,
    studentTeam,
    studentApplications,
    studentHistoryBindings,
    studentAvailableThemes,
    studentAvailableEnterprises,
    studentAvailableTeams,
    orgEnterprise,
    orgApplications,
    orgPendingApplications,
    orgBindings,
    orgInvites,
    orgTeams,
    orgHistoryTeams,
    orgMetrics,
    platformEnterprises,
    platformApplications,
    platformInvites,
    platformBindings,
    platformTeams,
    platformMetrics,
    refresh,
    submitApplication,
    bindByInviteCode,
    approveApplication,
    rejectApplication,
    generateInvites,
    unbindInvite,
    createTeam,
    joinTeam,
    leaveTeam,
    lockTeam,
    reviewEnterprise,
    updateEnterpriseQuota,
    toggleEnterpriseTheme,
  }
})
