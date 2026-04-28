import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { knowledgeTree, defaultUnlockedIds, allChildIds } from '@/mock/knowledge.js'

export const useKnowledgeStore = defineStore('knowledge', () => {
  const tree = ref(knowledgeTree)
  const unlockedNodeIds = ref(
    JSON.parse(localStorage.getItem('pook_unlocked_nodes')) || [...defaultUnlockedIds]
  )

  const totalChildren = allChildIds.length
  const unlockedCount = computed(() => unlockedNodeIds.value.length)

  const level = computed(() => {
    const c = unlockedNodeIds.value.length
    if (c === 0) return '--'
    if (c <= 5) return 'L1'
    if (c <= 12) return 'L2'
    if (c <= 22) return 'L3'
    if (c <= 32) return 'L4'
    return 'L5'
  })

  const coveredCategories = computed(() =>
    tree.value.filter(p => p.children.some(c => unlockedNodeIds.value.includes(c.id))).length
  )

  // Per-parent progress with full child details
  const branchProgress = computed(() =>
    tree.value.map(p => ({
      id: p.id, name: p.name, emoji: p.emoji, color: p.color, description: p.description,
      total: p.children.length,
      unlocked: p.children.filter(c => unlockedNodeIds.value.includes(c.id)).length,
      children: p.children.map(c => ({
        id: c.id, name: c.name, desc: c.desc,
        unlocked: unlockedNodeIds.value.includes(c.id),
        questionIds: c.questionIds
      }))
    }))
  )

  function isUnlocked(childId) { return unlockedNodeIds.value.includes(childId) }

  function unlockNode(childId) {
    if (!unlockedNodeIds.value.includes(childId)) {
      unlockedNodeIds.value.push(childId)
      _save()
      return true
    }
    return false
  }

  function unlockNodes(ids) {
    let added = []
    ids.forEach(id => {
      if (!unlockedNodeIds.value.includes(id)) {
        unlockedNodeIds.value.push(id)
        added.push(id)
      }
    })
    if (added.length) _save()
    return added
  }

  function unlockByQuestion(questionId) {
    const unlocked = []
    tree.value.forEach(parent => {
      parent.children.forEach(child => {
        if (child.questionIds.includes(questionId) && !unlockedNodeIds.value.includes(child.id)) {
          unlockedNodeIds.value.push(child.id)
          unlocked.push({ parentName: parent.name, childName: child.name, childId: child.id })
        }
      })
    })
    if (unlocked.length) _save()
    return unlocked
  }

  function randomUnlockNodes() {
    const locked = allChildIds.filter(id => !unlockedNodeIds.value.includes(id))
    if (!locked.length) return []
    const count = Math.min(Math.floor(Math.random() * 3) + 1, locked.length)
    const toUnlock = locked.sort(() => Math.random() - 0.5).slice(0, count)
    return unlockNodes(toUnlock)
  }

  function getNodeById(childId) {
    for (const p of tree.value) {
      const c = p.children.find(c => c.id === childId)
      if (c) return { ...c, parentName: p.name, parentColor: p.color }
    }
    return null
  }

  // Clear all progress (for debugging / fresh start)
  function resetProgress() {
    unlockedNodeIds.value = [...defaultUnlockedIds]
    _save()
  }

  function _save() {
    localStorage.setItem('pook_unlocked_nodes', JSON.stringify(unlockedNodeIds.value))
  }

  return {
    tree, unlockedNodeIds, unlockedCount, totalChildren, level,
    coveredCategories, branchProgress,
    isUnlocked, unlockNode, unlockNodes, unlockByQuestion,
    randomUnlockNodes, getNodeById, resetProgress
  }
})
