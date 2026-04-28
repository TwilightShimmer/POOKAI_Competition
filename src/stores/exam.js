import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { moonMissions } from '@/mock/moonQuestions.js'
import { examStages, EXAM_QUESTION_COUNT } from '@/mock/examLevels.js'

export const useExamStore = defineStore('exam', () => {
  const stages = ref(examStages)
  const allQuestions = computed(() => moonMissions.flatMap(m => m.questions))

  // Persisted state
  const passedLevels = ref(JSON.parse(localStorage.getItem('pook_passed_levels')) || [])
  const currentLevel = ref(null)
  const currentQuestions = ref([])
  const userAnswers = ref({})
  const examResult = ref(JSON.parse(localStorage.getItem('pook_exam_result')) || null)
  const currentIndex = ref(0)
  const wrongRecords = ref(JSON.parse(localStorage.getItem('pook_wrong_records')) || [])
  const assessResult = ref(null)

  const hasPassedLevel = (levelId) => passedLevels.value.includes(levelId)

  const isStageUnlocked = (stage) => {
    if (!stage.unlockCondition) return true
    return passedLevels.value.includes(stage.unlockCondition)
  }

  const isLevelAccessible = (level) => {
    const stage = stages.value.find(s => s.levels.some(l => l.id === level.id))
    return isStageUnlocked(stage)
  }

  function getQuestionsForLevel(levelId) {
    const level = stages.value.flatMap(s => s.levels).find(l => l.id === levelId)
    if (!level) return []
    const [start, end] = level.questionRange
    return allQuestions.value.filter(q => q.id >= start && q.id <= end)
  }

  function startExam(levelId) {
    currentLevel.value = levelId
    const pool = getQuestionsForLevel(levelId)
    // Randomly pick EXAM_QUESTION_COUNT questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    currentQuestions.value = shuffled.slice(0, Math.min(EXAM_QUESTION_COUNT, pool.length))
    userAnswers.value = {}
    currentIndex.value = 0
    examResult.value = null
  }

  function runAssessment(levelId) {
    const pool = getQuestionsForLevel(levelId)
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const assessQs = shuffled.slice(0, 3)
    assessResult.value = { levelId, questions: assessQs, weakAreas: [] }
    return assessQs
  }

  function answerQuestion(qId, answerIndex) {
    userAnswers.value[qId] = answerIndex
    localStorage.setItem('pook_exam_answers', JSON.stringify(userAnswers.value))
  }

  function submitExam() {
    let correct = 0
    const wrongs = []
    currentQuestions.value.forEach(q => {
      if (userAnswers.value[q.id] === q.answer) {
        correct++
      } else {
        wrongs.push({ questionId: q.id, title: q.title, userAnswer: userAnswers.value[q.id], correctAnswer: q.answer })
      }
    })
    const total = currentQuestions.value.length
    const score = Math.round((correct / total) * 100)
    const passed = score >= 60

    examResult.value = {
      levelId: currentLevel.value, score, correct, total, passed,
      wrongs, time: Date.now()
    }

    if (passed && !passedLevels.value.includes(currentLevel.value)) {
      passedLevels.value.push(currentLevel.value)
      localStorage.setItem('pook_passed_levels', JSON.stringify(passedLevels.value))
    }

    // Save wrong records
    wrongs.forEach(w => {
      if (!wrongRecords.value.find(r => r.questionId === w.questionId)) {
        wrongRecords.value.push(w)
      }
    })
    localStorage.setItem('pook_wrong_records', JSON.stringify(wrongRecords.value))
    localStorage.setItem('pook_exam_result', JSON.stringify(examResult.value))

    return examResult.value
  }

  function resetExam() {
    currentLevel.value = null
    currentQuestions.value = []
    userAnswers.value = {}
    currentIndex.value = 0
    examResult.value = null
  }

  return {
    stages, allQuestions, passedLevels, currentLevel, currentQuestions,
    userAnswers, examResult, currentIndex, wrongRecords, assessResult,
    hasPassedLevel, isStageUnlocked, isLevelAccessible,
    getQuestionsForLevel, startExam, runAssessment,
    answerQuestion, submitExam, resetExam
  }
})
