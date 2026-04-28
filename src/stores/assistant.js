import { defineStore } from 'pinia'
import { ref } from 'vue'
import { qaRules, faqList as defaultFaq } from '@/mock/qaRules.js'

export const useAssistantStore = defineStore('assistant', () => {
  const rules = ref(qaRules)
  const faqList = ref(defaultFaq)
  const chatMessages = ref(JSON.parse(localStorage.getItem('pook_chat')) || [])
  const askCount = ref(parseInt(localStorage.getItem('pook_ask_count')) || 0)

  function matchAnswer(input) {
    const text = input.toLowerCase()
    for (const rule of rules.value) {
      if (rule.keywords.some(kw => text.includes(kw))) {
        return rule.answer
      }
    }
    return '我目前只回答赛事规则相关问题哦，请继续问我比赛、任务、计分、报名相关内容。😊'
  }

  function sendQuestion(question) {
    const userMsg = { role: 'user', content: question, time: Date.now() }
    chatMessages.value.push(userMsg)

    askCount.value++
    localStorage.setItem('pook_ask_count', String(askCount.value))

    const answer = matchAnswer(question)
    const botMsg = { role: 'bot', content: answer, time: Date.now() + 1 }
    chatMessages.value.push(botMsg)

    localStorage.setItem('pook_chat', JSON.stringify(chatMessages.value))
    return botMsg
  }

  function clearMessages() {
    chatMessages.value = []
    localStorage.setItem('pook_chat', JSON.stringify([]))
  }

  return { rules, faqList, chatMessages, askCount, sendQuestion, clearMessages, matchAnswer }
})
