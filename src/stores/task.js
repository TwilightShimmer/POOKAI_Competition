import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { themes } from '@/mock/themes.js'
import { tasks as mockTasks } from '@/mock/tasks.js'

export const useTaskStore = defineStore('task', () => {
  const allThemes = ref(themes)
  const tasks = ref(mockTasks.map(t => ({ ...t })))
  const completedTaskIds = ref(JSON.parse(localStorage.getItem('pook_completed_tasks')) || [])
  const unlockedBadges = ref(JSON.parse(localStorage.getItem('pook_badges')) || [])

  function getTasksByTheme(themeId) {
    return tasks.value
      .filter(t => t.themeId === themeId)
      .map(t => ({
        ...t,
        status: completedTaskIds.value.includes(t.id) ? 'done' : t.status
      }))
  }

  const completionCount = computed(() => completedTaskIds.value.length)
  const canTakeExam = computed(() => completedTaskIds.value.length >= 4)

  function completeTask(taskId) {
    if (completedTaskIds.value.includes(taskId)) return null
    completedTaskIds.value.push(taskId)
    localStorage.setItem('pook_completed_tasks', JSON.stringify(completedTaskIds.value))

    const task = tasks.value.find(t => t.id === taskId)
    if (task && task.rewardBadge && !unlockedBadges.value.includes(task.rewardBadge)) {
      unlockedBadges.value.push(task.rewardBadge)
      localStorage.setItem('pook_badges', JSON.stringify(unlockedBadges.value))
    }
    return task
  }

  function getCompletedTasksByType(type) {
    return tasks.value.filter(t => t.type === type && completedTaskIds.value.includes(t.id))
  }

  return {
    allThemes, tasks, completedTaskIds, unlockedBadges,
    getTasksByTheme, completionCount, canTakeExam,
    completeTask, getCompletedTasksByType
  }
})
