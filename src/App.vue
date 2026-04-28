<template>
  <div id="pook-app">
    <AppHeader v-if="showHeader" />
    <div class="app-layout">
      <MobileTabbar v-if="showTabbar" />
      <div :class="['app-content', { 'has-sidebar': showTabbar }]">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in"><component :is="Component" /></transition>
        </router-view>
      </div>
    </div>
    <XPToast />
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import AppHeader from '@/components/AppHeader.vue'
import MobileTabbar from '@/components/MobileTabbar.vue'
import XPToast from '@/components/XPToast.vue'
const route = useRoute(); const us = useUserStore()
const showHeader = computed(() => route.name !== 'Home')
const showTabbar = computed(() => route.name !== 'Login' && route.name !== 'Home' && us.isLoggedIn)
</script>
<style>
.fade-enter-active,.fade-leave-active{transition:opacity .15s}
.fade-enter-from,.fade-leave-to{opacity:0}
.app-layout{display:flex;min-height:100vh}
.app-content{flex:1;min-width:0}
@media(min-width:900px){
  .app-content.has-sidebar{margin-left:calc(var(--sidebar-w) + 18px)}
}
</style>
