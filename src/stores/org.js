import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dashboardStats as stats, students as mockStudents, clubs as mockClubs, faqStats as mockFaq, activeThemes as mockThemes } from '@/mock/org.js'

export const useOrgStore = defineStore('org', () => {
  const dashboardStats = ref(stats)
  const students = ref(mockStudents)
  const clubs = ref(mockClubs)
  const faqStats = ref(mockFaq)
  const activeThemes = ref(mockThemes)

  return { dashboardStats, students, clubs, faqStats, activeThemes }
})
