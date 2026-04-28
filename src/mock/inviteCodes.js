import { getInviteInfo } from '@/mock/prdDb.js'

export const themeInfo = {
  moon: {
    name: '月球行动',
    emoji: '🌙',
    color: '#2383e2',
    bgImage: '/themes/moon-map.jpg',
  },
  mars: {
    name: '火星探索',
    emoji: '🚀',
    color: '#ff9f0a',
    bgImage: '/themes/mars-map.png',
  },
}

export function validateInviteCode(code) {
  const invite = getInviteInfo(code)
  if (!invite) return null

  return {
    team: invite.bindUserPhone ? '已绑定学员' : '待加入队伍',
    theme: invite.themeKey,
    themeName: invite.themeName,
    orgName: invite.orgName,
    status: invite.status,
    maxMembers: 5,
    contentReady: invite.contentReady,
    inviteCode: invite.inviteCode,
  }
}
