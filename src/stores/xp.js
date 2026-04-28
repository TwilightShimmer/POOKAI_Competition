import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useXPStore = defineStore('xp', () => {
  const totalXP = ref(parseInt(localStorage.getItem('pook_xp') || '0'))
  const streak = ref(parseInt(localStorage.getItem('pook_streak') || '1'))
  const show = ref(false)
  const amount = ref(0)

  function addXP(pts) {
    amount.value = pts
    totalXP.value += pts
    localStorage.setItem('pook_xp', totalXP.value.toString())
    show.value = true
    setTimeout(() => { show.value = false }, 1600)
  }

  function addStreak() {
    streak.value++
    localStorage.setItem('pook_streak', streak.value.toString())
  }

  return { totalXP, streak, show, amount, addXP, addStreak }
})
