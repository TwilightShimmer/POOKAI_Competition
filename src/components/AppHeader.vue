<template>
  <header class="top-bar">
    <router-link :to="homePath" class="tb-logo">
      <img class="logo-mark" src="/宣传素材/logo.png" alt="璞核 Logo" />
      <span class="logo-copy">
        <strong class="logo-text">POOK CORE</strong>
        <small class="logo-sub">赛事成长平台</small>
      </span>
    </router-link>

    <nav v-if="!userStore.isLoggedIn" class="tb-nav hide-mobile">
      <a href="/#home" class="tb-nav-link">首页</a>
      <a href="/#belief" class="tb-nav-link">产品理念</a>
      <a href="/#product" class="tb-nav-link">产品体系</a>
      <router-link to="/theme-intro" class="tb-nav-link">赛事主题</router-link>
      <a href="/#about" class="tb-nav-link">关于我们</a>
      <a href="/#service" class="tb-nav-link">赛事服务</a>
    </nav>

    <div class="tb-spacer"></div>

    <template v-if="userStore.isLoggedIn">
      <div class="tb-badge role">{{ userStore.roleLabel }}</div>
      <div v-if="contextLabel" class="tb-badge">
        <span class="tb-badge-name">{{ contextLabel }}</span>
      </div>
      <div v-if="userStore.currentRole === 'student'" class="tb-stat">{{ xpStore.totalXP }} XP</div>
      <button class="tb-logout" @click="handleLogout">退出</button>
    </template>

    <template v-else>
      <router-link to="/login" class="btn btn-sm btn-ghost">登录</router-link>
      <router-link to="/login" class="btn btn-sm btn-primary">立即体验</router-link>
    </template>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import { useXPStore } from '@/stores/xp.js'

const router = useRouter()
const userStore = useUserStore()
const xpStore = useXPStore()

const homePath = computed(() => {
  if (!userStore.isLoggedIn) return '/'
  return {
    student: userStore.inviteCode && userStore.themeContentReady ? '/tasks' : '/student',
    org: '/org',
    platform: '/platform',
  }[userStore.currentRole] || '/'
})

const contextLabel = computed(() => {
  if (userStore.currentRole === 'student') {
    return userStore.teamName || userStore.orgName || '未绑定机构'
  }
  if (userStore.currentRole === 'org') {
    return userStore.orgName || '机构端'
  }
  if (userStore.currentRole === 'platform') {
    return userStore.currentSeasonName || '平台运营'
  }
  return ''
})

function handleLogout() {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.top-bar {
  position: fixed;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: 200;
  height: var(--header-h);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 22px;
  background: rgba(251, 248, 243, 0.82);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.tb-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text);
}

.logo-mark {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
}

.logo-copy {
  display: grid;
  gap: 2px;
}

.logo-text {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text);
}

.logo-sub {
  font-size: 11px;
  color: var(--text-light);
  line-height: 1;
}

.tb-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 10px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.03);
}

.tb-nav-link {
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 520;
  color: var(--text-light);
  text-decoration: none;
  transition: color 0.14s, background 0.14s;
}

.tb-nav-link:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.92);
}

.hide-mobile {
  display: none;
}

.tb-spacer {
  flex: 1;
}

.tb-stat,
.tb-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--border);
  color: var(--text-light);
}

.tb-badge.role {
  font-weight: 700;
  color: var(--text);
}

.tb-stat {
  font-weight: 700;
}

.tb-badge-name {
  max-width: 132px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tb-logout {
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-light);
  font-size: 12px;
  font-weight: 520;
  cursor: pointer;
  transition: color 0.14s, border-color 0.14s, background 0.14s;
}

.tb-logout:hover {
  color: var(--text);
  background: rgba(0, 0, 0, 0.04);
}

@media (min-width: 1100px) {
  .top-bar {
    top: 14px;
    left: 18px;
    right: 18px;
    padding: 0 20px;
  }

  .hide-mobile {
    display: flex;
  }
}

@media (max-width: 720px) {
  .logo-sub {
    display: none;
  }
}
</style>
