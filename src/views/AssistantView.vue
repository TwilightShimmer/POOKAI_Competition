<template>
  <div class="page assistant-page">
    <div class="container">
      <div class="assistant-layout">
        <section class="chat-main card">
          <div class="chat-header">
            <div class="avatar-wrap">
              <AssistantAvatar />
            </div>
            <div class="chat-header-text">
              <strong>POOK 赛事助手</strong>
              <span>回答比赛规则、报名方式、计分逻辑与训练流程，保持单任务导向，不做闲聊型噪音输出。</span>
            </div>
          </div>

          <div class="chat-messages" ref="msgBox">
            <EmptyState v-if="!store.chatMessages.length" icon="" text="从右侧高频问题开始，或者直接输入你的问题。" />
            <ChatBubble v-for="(msg, index) in store.chatMessages" :key="index" :msg="msg" />
          </div>

          <div class="quick-qs">
            <button v-for="question in store.faqList" :key="question" class="qq-btn" @click="send(question)">
              {{ question }}
            </button>
          </div>

          <div class="chat-input">
            <input v-model="inputText" @keydown.enter="send(inputText)" placeholder="输入你的问题..." />
            <button class="btn btn-primary btn-sm" @click="send(inputText)">发送</button>
            <button class="btn btn-ghost btn-sm" @click="store.clearMessages()">清空</button>
          </div>
        </section>

        <aside class="chat-side">
          <section class="side-card card">
            <div class="mono-label">高频问题</div>
            <div class="faq-list">
              <button v-for="question in store.faqList" :key="question" class="faq-item" @click="send(question)">
                {{ question }}
              </button>
            </div>
          </section>

          <section class="side-card card">
            <div class="mono-label">回答范围</div>
            <p class="side-note">当前是本地规则型助教，不调用外部大模型，优先给出确定性的说明与路径指引。</p>
          </section>

          <router-link to="/tasks" class="btn btn-ghost btn-sm side-link">← 返回任务台</router-link>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { useAssistantStore } from '@/stores/assistant.js'
import AssistantAvatar from '@/components/AssistantAvatar.vue'
import ChatBubble from '@/components/ChatBubble.vue'
import EmptyState from '@/components/EmptyState.vue'

const store = useAssistantStore()
const inputText = ref('')
const msgBox = ref(null)

async function send(text) {
  if (!text || !text.trim()) return
  store.sendQuestion(text.trim())
  inputText.value = ''
  await nextTick()
  if (msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight
}
</script>

<style scoped>
.assistant-page {
  animation: fadeSlideUp 0.32s ease;
}

.assistant-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 18px;
  align-items: start;
}

.chat-main {
  min-height: 720px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.avatar-wrap {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(53,53,53,1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chat-header-text strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 4px;
}

.chat-header-text span {
  display: block;
  color: var(--text-light);
  line-height: 1.7;
}

.chat-messages {
  flex: 1;
  min-height: 360px;
  padding: 18px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(0,0,0,0.025) 0%, rgba(255,255,255,0.9) 100%);
  border: 1px solid rgba(0,0,0,0.06);
  overflow-y: auto;
  margin-bottom: 14px;
}

.quick-qs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.qq-btn,
.faq-item {
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.92);
  color: var(--text-light);
  cursor: pointer;
  transition: background 0.14s ease, border-color 0.14s ease, color 0.14s ease, transform 0.14s ease;
}

.qq-btn:hover,
.faq-item:hover {
  background: var(--white);
  border-color: rgba(0,0,0,0.16);
  color: var(--text);
  transform: translateY(-1px);
}

.chat-input {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 8px;
}

.chat-input input {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.94);
  color: var(--text);
}

.chat-input input:focus {
  border-color: rgba(0,0,0,0.18);
  box-shadow: 0 0 0 4px rgba(0,0,0,0.04);
}

.chat-side {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.side-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.faq-item {
  justify-content: flex-start;
  text-align: left;
}

.side-note {
  color: var(--text-light);
  line-height: 1.7;
  font-size: 0.9rem;
}

.side-link {
  width: 100%;
}

@media (max-width: 980px) {
  .assistant-layout {
    grid-template-columns: 1fr;
  }

  .chat-main {
    min-height: auto;
  }
}

@media (max-width: 640px) {
  .chat-input {
    grid-template-columns: 1fr;
  }
}
</style>
