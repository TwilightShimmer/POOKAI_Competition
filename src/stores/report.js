import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useTaskStore } from './task.js'
import { useAssistantStore } from './assistant.js'
import { useKnowledgeStore } from './knowledge.js'

export const useReportStore = defineStore('report', () => {
  const taskStore = useTaskStore()
  const assistantStore = useAssistantStore()
  const knowledgeStore = useKnowledgeStore()

  const askAbility        = computed(() => Math.min(Math.round(Math.min(assistantStore.askCount * 8, 50) + taskStore.completionCount * 3), 100))
  const handsOnAbility    = computed(() => Math.min(Math.round((taskStore.getCompletedTasksByType('judge').length + taskStore.getCompletedTasksByType('image').length) * 16), 100))
  const engineeringAbility= computed(() => Math.min(Math.round(taskStore.getCompletedTasksByType('sort').length * 20 + taskStore.getCompletedTasksByType('single').length * 8), 100))
  const knowledgeAbility  = computed(() => Math.min(Math.round(knowledgeStore.unlockedCount * 3 + knowledgeStore.coveredCategories * 7), 100))
  const completionAbility = computed(() => Math.min(Math.round((taskStore.completionCount / 18) * 100), 100))

  const abilities = computed(() => [
    { name: '提问能力',   value: askAbility.value },
    { name: '动手能力',   value: handsOnAbility.value },
    { name: '工程思维',   value: engineeringAbility.value },
    { name: '知识连接',   value: knowledgeAbility.value },
    { name: '任务完成度', value: completionAbility.value },
  ])

  const summaryText = computed(() => {
    const c = taskStore.completionCount
    if (c === 0) return '还没有开始学习之旅，快去完成第一个任务吧！'
    if (c < 4) return `已完成 ${c} 个任务，继续努力！`
    return '表现出色！继续探索更多知识点吧。'
  })

  const recommendations = computed(() => {
    const recs = []
    if (taskStore.completionCount < 4) recs.push({ text: '继续完成赛事任务', link: '/tasks', icon: '🎯' })
    if (assistantStore.askCount < 3)   recs.push({ text: '去问问 AI 助教',   link: '/assistant', icon: '🤖' })
    if (recs.length === 0)             recs.push({ text: '探索更多知识点',    link: '/knowledge', icon: '🌳' })
    return recs
  })

  return { askAbility, handsOnAbility, engineeringAbility, knowledgeAbility, completionAbility, abilities, summaryText, recommendations }
})
