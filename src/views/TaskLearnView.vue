<template>
  <div class="page learn-page">
    <div class="container">
      <section class="learn-hero card">
        <button class="back-btn" @click="router.back()">← 返回任务台</button>

        <div class="hero-main">
          <div class="hero-copy">
            <div class="mono-label">{{ taskId }}</div>
            <h1>{{ task?.name }}</h1>
            <p>{{ task?.summary }}</p>
          </div>
          <div class="hero-side">
            <div class="hero-chip">
              <span>任务积分</span>
              <strong>{{ task?.maxScore || 0 }} XP</strong>
            </div>
            <div class="hero-chip">
              <span>当前进度</span>
              <strong>{{ currentStep === 0 ? '准备学习' : answeredCount + '/' + questions.length }}</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="steps card">
        <div v-for="(step, index) in steps" :key="step" :class="['step', { active: currentStep === index, done: currentStep > index }]">
          <div class="step-index">{{ currentStep > index ? '✓' : String(index + 1).padStart(2, '0') }}</div>
          <div class="step-copy">
            <strong>{{ step }}</strong>
            <span>{{ index === 0 ? '完成观看后进入答题' : '全部题目完成后提交' }}</span>
          </div>
        </div>
      </section>

      <section v-if="currentStep === 0" class="card video-panel">
        <div class="panel-head">
          <div>
            <div class="mono-label">Step 01</div>
            <h2>任务背景学习</h2>
          </div>
          <div class="panel-badge">{{ videoWatched ? '已完成' : '观看中' }}</div>
        </div>

        <p class="panel-desc">先快速理解任务背景，再进入题目判断。交互上保持单任务聚焦，不同时出现过多干扰信息。</p>

        <div class="video-wrap">
          <video
            v-if="taskVideoSrc"
            ref="videoEl"
            class="task-video"
            controls
            preload="metadata"
            @ended="videoWatched = true"
            @timeupdate="onTimeUpdate"
          >
            <source :src="taskVideoSrc" type="video/mp4" />
            您的浏览器不支持视频播放
          </video>
          <div v-else class="video-empty">
            当前任务暂无本地视频素材，可直接进入答题。
          </div>
          <div v-if="!videoWatched" class="video-overlay-hint">观看完成后自动解锁答题</div>
        </div>

        <div class="video-meta">
          <div class="glow-bar">
            <div class="glow-fill" :style="{ width: videoProgress + '%' }"></div>
          </div>
          <span>{{ videoWatched ? '✅ 视频已完成' : `已观看 ${Math.round(videoProgress)}%` }}</span>
        </div>

        <div class="panel-actions">
          <button class="btn btn-primary btn-lg" :disabled="!videoWatched" @click="currentStep = 1">
            开始答题
          </button>
          <button v-if="!videoWatched" class="btn btn-ghost btn-lg" @click="skipVideo">
            跳过视频
          </button>
        </div>
      </section>

      <section v-if="currentStep === 1" class="card quiz-panel">
        <div class="panel-head">
          <div>
            <div class="mono-label">Step 02</div>
            <h2>完成任务题目</h2>
          </div>
          <div class="panel-badge quiet">共 {{ questions.length }} 题</div>
        </div>

        <div class="quiz-toolbar">
          <div class="quiz-progress">
            <div class="glow-bar">
              <div class="glow-fill" :style="{ width: questions.length ? (answeredCount / questions.length * 100) + '%' : '0%' }"></div>
            </div>
            <span>{{ answeredCount }} / {{ questions.length }}</span>
          </div>
          <div class="quiz-score">{{ correctCount }} 题正确</div>
        </div>

        <div v-if="questionsLoading" class="quiz-empty">
          题库载入中...
        </div>

        <div v-else-if="!questions.length" class="quiz-empty">
          当前任务暂无可作答题目，已接入学习素材但题库内容为空。
        </div>

        <div v-else class="questions-list">
          <article
            v-for="(q, qi) in questions"
            :key="q.id"
            :class="['q-card', {
              answered: answers[q.id] !== undefined,
              correct: answers[q.id] === q.answer,
              wrong: answers[q.id] !== undefined && answers[q.id] !== q.answer
            }]"
          >
            <div class="qc-head">
              <div class="qc-title-wrap">
                <span class="qc-num">{{ String(qi + 1).padStart(2, '0') }}</span>
                <div>
                  <strong>{{ q.title }}</strong>
                  <p>{{ q.subject }}</p>
                </div>
              </div>

              <span v-if="answers[q.id] === q.answer" class="qc-badge success">正确</span>
              <span v-else-if="answers[q.id] !== undefined" class="qc-badge danger">错误</span>
            </div>

            <div class="qc-scene">
              <img v-if="q.sceneSrc" :src="q.sceneSrc" :alt="q.title" class="scene-img" loading="lazy" />
            </div>

            <p class="qc-voice">{{ q.voice }}</p>

            <div :class="['options-grid', { 'three-col': q.options.length === 3 }]">
              <button
                v-for="opt in q.options"
                :key="opt.key"
                :class="['opt-btn',
                  { selected: answers[q.id] === opt.key },
                  { correct: answers[q.id] !== undefined && opt.key === q.answer },
                  { wrong: answers[q.id] === opt.key && opt.key !== q.answer },
                  { disabled: answers[q.id] !== undefined }
                ]"
                :disabled="answers[q.id] !== undefined"
                @click="submitAnswer(q, opt.key)"
              >
                <div v-if="opt.imageSrc" class="opt-img-wrap">
                  <img
                    :src="opt.imageSrc"
                    :alt="opt.label"
                    class="opt-img"
                    loading="lazy"
                    @error="(event) => event.target.style.display='none'"
                  />
                </div>
                <div class="opt-label">
                  <span class="opt-key">{{ opt.key }}</span>
                  <span class="opt-text">{{ opt.label }}</span>
                </div>
              </button>
            </div>

            <div v-if="answers[q.id] !== undefined" class="qc-explanation">
              <span class="mono-label">考点</span>
              <span>{{ q.subject }}</span>
            </div>
          </article>
        </div>

        <div v-if="!questionsLoading && questions.length && answeredCount === questions.length" class="complete-area">
          <div class="score-summary">
            <div>
              <div class="mono-label">任务结果</div>
              <div class="score-big">{{ correctCount }}/{{ questions.length }}</div>
            </div>
            <div class="score-side">正确率 {{ Math.round(correctCount / questions.length * 100) }}%</div>
          </div>

          <p v-if="isReviewMode" class="review-hint">当前为复习模式，重复学习不会再次获得 XP。</p>

          <button class="btn btn-primary btn-lg btn-block" @click="completeTask">
            {{ isReviewMode ? '完成复习并返回' : '完成任务并返回' }}
          </button>
        </div>
      </section>
    </div>

    <div v-if="showCelebrate" class="celebrate-overlay">
      <div v-for="i in 16" :key="i" class="particle" :style="particleStyle(i)"></div>
      <div class="celebrate-text">{{ celebrateText }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useXPStore } from '@/stores/xp.js'
import { useKnowledgeStore } from '@/stores/knowledge.js'
import { getTaskVideoSrc } from '@/mock/taskAssets.js'
import { loadTaskQuestions } from '@/mock/taskQuestions.js'
import { getMissionTaskById } from '@/mock/themeMissionTasks.js'

const route = useRoute()
const router = useRouter()
const xps = useXPStore()
const ks = useKnowledgeStore()

const taskId = route.params.taskId
const task = computed(() => getMissionTaskById(taskId))
const taskVideoSrc = computed(() => getTaskVideoSrc(taskId))
const isReviewMode = ref(JSON.parse(localStorage.getItem('pook_task_done') || '[]').includes(taskId))

const steps = ['观看视频', '完成答题']
const currentStep = ref(0)

const videoEl = ref(null)
const videoWatched = ref(false)
const videoProgress = ref(0)

function onTimeUpdate() {
  if (!videoEl.value) return
  const { currentTime, duration } = videoEl.value
  if (duration > 0) {
    videoProgress.value = (currentTime / duration) * 100
    if (videoProgress.value >= 95) videoWatched.value = true
  }
}

function skipVideo() {
  videoWatched.value = true
  currentStep.value = 1
}

const questions = ref([])
const questionsLoading = ref(true)
const answers = ref({})

onMounted(async () => {
  try {
    questions.value = await loadTaskQuestions(taskId, 10)
  } catch (error) {
    console.error('Failed to load task questions:', taskId, error)
    questions.value = []
  } finally {
    questionsLoading.value = false
  }
  if (!taskVideoSrc.value) {
    videoWatched.value = true
  }
})

const answeredCount = computed(() => Object.keys(answers.value).length)
const correctCount = computed(() => questions.value.filter((q) => answers.value[q.id] === q.answer).length)

function submitAnswer(question, key) {
  if (answers.value[question.id] !== undefined) return
  answers.value[question.id] = key
  answers.value = { ...answers.value }
}

const showCelebrate = ref(false)
const celebrateText = ref('')

function completeTask() {
  const done = JSON.parse(localStorage.getItem('pook_task_done') || '[]')
  const firstCompletion = !done.includes(taskId)

  if (firstCompletion) {
    done.push(taskId)
    localStorage.setItem('pook_task_done', JSON.stringify(done))
    xps.addXP(task.value?.maxScore || 0)
    ks.randomUnlockNodes()
    celebrateText.value = `+${task.value?.maxScore || 0} XP`
  } else {
    celebrateText.value = '复习完成'
  }

  isReviewMode.value = true

  showCelebrate.value = true
  setTimeout(() => {
    showCelebrate.value = false
    router.push('/tasks')
  }, firstCompletion ? 2200 : 1400)
}

function particleStyle(i) {
  const colors = ['#2fb46c', '#2383e2', '#d1a033', '#7c5cff', '#ff9f0a', '#e5484d', '#d84f9f']
  const angle = (i / 16) * 360
  const distance = 70 + Math.random() * 50
  return {
    '--px': Math.cos(angle * Math.PI / 180) * distance + 'px',
    '--py': Math.sin(angle * Math.PI / 180) * distance + 'px',
    background: colors[i % colors.length],
  }
}
</script>

<style scoped>
.learn-page {
  animation: fadeSlideUp 0.32s ease;
}

.learn-hero {
  margin-bottom: 18px;
}

.back-btn {
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.8);
  color: var(--text-light);
  cursor: pointer;
  transition: color 0.14s, background 0.14s, border-color 0.14s;
}

.back-btn:hover {
  color: var(--text);
  background: var(--white);
  border-color: var(--border-strong);
}

.hero-main {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr) 220px;
  gap: 18px;
  align-items: start;
  margin-top: 16px;
}

.hero-mark {
  width: 88px;
  height: 88px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(0,0,0,0.96) 0%, rgba(53,53,53,1) 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  box-shadow: var(--shadow-md);
}

.hero-copy h1 {
  font-size: var(--page-title-size);
  margin: 6px 0 10px;
}

.hero-copy p {
  max-width: 740px;
  color: var(--text-light);
  line-height: 1.75;
}

.hero-side {
  display: grid;
  gap: 10px;
}

.hero-chip {
  padding: 14px;
  border-radius: 18px;
  background: rgba(0,0,0,0.035);
  border: 1px solid rgba(0,0,0,0.06);
}

.hero-chip span {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: var(--ls-mono);
  color: var(--text-muted);
  margin-bottom: 8px;
}

.hero-chip strong {
  font-size: 1rem;
  font-weight: 620;
}

.steps {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 18px;
}

.step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.06);
}

.step.active {
  background: rgba(124,92,255,0.08);
  border-color: rgba(124,92,255,0.16);
}

.step.done {
  background: rgba(47,180,108,0.08);
  border-color: rgba(47,180,108,0.16);
}

.step-index {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: rgba(255,255,255,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--text);
}

.step-copy strong {
  display: block;
  margin-bottom: 2px;
  font-size: 0.96rem;
}

.step-copy span {
  color: var(--text-light);
  font-size: 0.82rem;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.panel-head h2 {
  font-size: 1.35rem;
  margin-top: 4px;
}

.panel-badge {
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(47,180,108,0.08);
  color: var(--green-dark);
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
}

.panel-badge.quiet {
  background: rgba(0,0,0,0.04);
  color: var(--text-light);
}

.panel-desc {
  color: var(--text-light);
  line-height: 1.75;
  margin-bottom: 18px;
}

.video-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  background: #000;
  margin-bottom: 14px;
}

.task-video {
  width: 100%;
  display: block;
  max-height: 420px;
  object-fit: contain;
}

.video-empty {
  min-height: 280px;
  display: grid;
  place-items: center;
  padding: 32px 24px;
  color: rgba(255,255,255,0.8);
  background:
    radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 55%),
    linear-gradient(135deg, #111 0%, #262626 100%);
  text-align: center;
  line-height: 1.7;
}

.video-overlay-hint {
  position: absolute;
  right: 16px;
  bottom: 16px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(0,0,0,0.64);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.video-meta,
.quiz-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.video-meta span,
.quiz-progress span,
.quiz-score {
  white-space: nowrap;
  color: var(--text-light);
  font-size: 0.84rem;
  font-weight: 600;
}

.video-meta .glow-bar,
.quiz-progress .glow-bar {
  flex: 1;
}

.panel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.quiz-toolbar {
  justify-content: space-between;
}

.quiz-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.quiz-score {
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(0,0,0,0.04);
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.quiz-empty {
  padding: 28px 20px;
  border-radius: 18px;
  background: rgba(0,0,0,0.03);
  color: var(--text-light);
  text-align: center;
  line-height: 1.7;
}

.q-card {
  border-radius: 22px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.84);
  padding: 18px;
  transition: border-color 0.14s ease, box-shadow 0.18s ease, transform 0.14s ease;
}

.q-card.correct {
  border-color: rgba(47,180,108,0.24);
  background: linear-gradient(180deg, rgba(47,180,108,0.06) 0%, rgba(255,255,255,0.98) 100%);
}

.q-card.wrong {
  border-color: rgba(229,72,77,0.24);
  background: linear-gradient(180deg, rgba(229,72,77,0.05) 0%, rgba(255,255,255,0.98) 100%);
}

.qc-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.qc-title-wrap {
  display: flex;
  gap: 10px;
}

.qc-title-wrap strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 4px;
}

.qc-title-wrap p {
  color: var(--text-light);
  font-size: 0.82rem;
}

.qc-num {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: rgba(0,0,0,0.05);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text);
}

.qc-badge {
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
}

.qc-badge.success {
  background: rgba(47,180,108,0.1);
  color: var(--green-dark);
}

.qc-badge.danger {
  background: rgba(229,72,77,0.1);
  color: var(--red-dark);
}

.qc-scene {
  margin-bottom: 14px;
  border-radius: 18px;
  overflow: hidden;
}

.scene-img {
  width: 100%;
  max-height: 280px;
  object-fit: cover;
  display: block;
}

.qc-voice {
  margin-bottom: 14px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(0,0,0,0.03);
  color: var(--text);
  line-height: 1.7;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.options-grid.three-col {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.opt-btn {
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255,255,255,0.82);
  cursor: pointer;
  transition: border-color 0.14s ease, transform 0.14s ease, box-shadow 0.18s ease, background 0.14s ease;
  padding: 0;
}

.opt-btn:not(.disabled):hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.opt-btn.selected {
  border-color: rgba(124,92,255,0.24);
  background: rgba(124,92,255,0.06);
}

.opt-btn.correct {
  border-color: rgba(47,180,108,0.28);
  background: rgba(47,180,108,0.08);
}

.opt-btn.wrong {
  border-color: rgba(229,72,77,0.28);
  background: rgba(229,72,77,0.08);
}

.opt-btn.disabled {
  cursor: not-allowed;
}

.opt-img-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: rgba(0,0,0,0.03);
  overflow: hidden;
}

.opt-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.opt-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
}

.opt-key {
  min-width: 24px;
  height: 24px;
  border-radius: 8px;
  background: rgba(0,0,0,0.05);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-light);
}

.opt-btn.correct .opt-key {
  background: var(--green);
  color: #fff;
}

.opt-btn.wrong .opt-key {
  background: var(--red);
  color: #fff;
}

.opt-text {
  color: var(--text-light);
  font-size: 0.82rem;
  line-height: 1.5;
  text-align: left;
}

.qc-explanation {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(0,0,0,0.03);
  color: var(--text-light);
}

.complete-area {
  margin-top: 22px;
  padding: 22px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(0,0,0,0.03) 0%, rgba(255,255,255,0.92) 100%);
  border: 1px solid rgba(0,0,0,0.08);
}

.score-summary {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.score-big {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 650;
  line-height: 1;
}

.score-side {
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(0,0,0,0.04);
  display: inline-flex;
  align-items: center;
  color: var(--text-light);
  font-weight: 600;
}

.review-hint {
  margin: 0 0 12px;
  color: var(--text-light);
  text-align: center;
  font-size: 13px;
}

.celebrate-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  pointer-events: none;
}

.celebrate-text {
  font-size: 44px;
  font-weight: 900;
  color: var(--gold-dark);
  text-shadow: 0 2px 12px rgba(209,160,51,0.28);
  animation: xpPop 2s ease-out forwards;
}

.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: burst 1.2s ease-out forwards;
}

@keyframes burst {
  0% { transform: translate(0,0); opacity: 1; }
  100% { transform: translate(var(--px), var(--py)); opacity: 0; }
}

@media (max-width: 980px) {
  .hero-main {
    grid-template-columns: 72px minmax(0, 1fr);
  }

  .hero-side {
    grid-column: 1 / -1;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .steps,
  .hero-side,
  .options-grid,
  .options-grid.three-col {
    grid-template-columns: 1fr;
  }

  .video-meta,
  .quiz-toolbar,
  .score-summary {
    flex-direction: column;
    align-items: stretch;
  }

  .qc-head {
    flex-direction: column;
  }
}
</style>
