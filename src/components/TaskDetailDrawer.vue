<template>
  <div v-if="task" class="drawer-overlay" @click.self="$emit('close')">
    <div class="drawer">
      <button class="close-btn" @click="$emit('close')">✕</button>
      <div class="drawer-header">
        <span :class="['badge-tag', task.difficulty]">{{ {easy:'简单',medium:'中等',hard:'困难'}[task.difficulty] }}</span>
        <h2>{{ task.title }}</h2>
        <p>{{ task.shortDesc }}</p>
      </div>
      <div v-if="isDone" class="done-state"><div class="done-icon">✅</div><p>你已经完成了这个任务！</p><p class="done-badge">获得勋章：🏅 {{ task.rewardBadge }}</p></div>
      <div v-else class="task-body">
        <div class="question-text">{{ questionText }}</div>
        <div v-if="task.type==='single'" class="options-grid">
          <button v-for="(opt,i) in task.options" :key="i" :class="['opt-btn',{selected:selected===i,correct:submitted&&i===task.answer,wrong:submitted&&selected===i&&i!==task.answer}]" @click="!submitted&&(selected=i)" :disabled="submitted">{{ opt }}</button>
        </div>
        <div v-if="task.type==='image'" class="options-grid image-grid">
          <button v-for="(opt,i) in task.options" :key="i" :class="['opt-btn img-opt',{selected:selected===i,correct:submitted&&i===task.answer,wrong:submitted&&selected===i&&i!==task.answer}]" @click="!submitted&&(selected=i)" :disabled="submitted">
            <span class="img-emoji">{{ opt.emoji }}</span><span>{{ opt.label }}</span>
          </button>
        </div>
        <div v-if="task.type==='sort'" class="sort-area">
          <div v-for="(step,i) in sortedSteps" :key="i" class="sort-item">
            <span class="sort-num">{{ i+1 }}</span><span class="sort-text">{{ step }}</span>
            <div class="sort-btns">
              <button @click="moveStep(i,-1)" :disabled="i===0||submitted">↑</button>
              <button @click="moveStep(i,1)" :disabled="i===sortedSteps.length-1||submitted">↓</button>
            </div>
          </div>
        </div>
        <div v-if="task.type==='judge'" class="options-grid">
          <button v-for="(opt,i) in task.options" :key="i" :class="['opt-btn',{selected:selected===i,correct:submitted&&i===task.answer,wrong:submitted&&selected===i&&i!==task.answer}]" @click="!submitted&&(selected=i)" :disabled="submitted">{{ opt }}</button>
        </div>
        <div v-if="!submitted" class="action-bar"><button class="btn btn-primary" @click="handleSubmit" :disabled="!canSubmit">提交答案</button></div>
        <div v-else class="result-area">
          <div :class="['result-banner',isCorrect?'correct':'wrong']">{{ isCorrect?'🎉 回答正确！':'😅 回答有误' }}</div>
          <p class="explanation">{{ task.explanation }}</p>
          <button v-if="isCorrect" class="btn btn-gold" @click="handleComplete">领取奖励 🎁</button>
          <button v-else class="btn btn-secondary" @click="resetTask">再试一次</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useTaskStore } from '@/stores/task.js'
import { useKnowledgeStore } from '@/stores/knowledge.js'
const props = defineProps({ task: Object })
const emit = defineEmits(['close','completed'])
const taskStore = useTaskStore(); const knowledgeStore = useKnowledgeStore()
const selected = ref(null); const submitted = ref(false); const sortedSteps = ref([])
const isDone = computed(() => props.task && taskStore.completedTaskIds.includes(props.task.id))
const questionText = computed(() => props.task?.question || '')
watch(() => props.task, (t) => { selected.value=null; submitted.value=false; if(t&&t.type==='sort') sortedSteps.value=[...t.steps].sort(()=>Math.random()-0.5) }, { immediate: true })
const canSubmit = computed(() => { if(!props.task) return false; if(props.task.type==='sort') return true; return selected.value!==null })
const isCorrect = computed(() => { if(!props.task||!submitted.value) return false; if(props.task.type==='sort') return sortedSteps.value.every((s,i)=>s===props.task.steps[i]); return selected.value===props.task.answer })
function moveStep(i,d){ const a=[...sortedSteps.value];const t=i+d;[a[i],a[t]]=[a[t],a[i]];sortedSteps.value=a }
function handleSubmit(){ submitted.value=true }
function resetTask(){ selected.value=null; submitted.value=false; if(props.task.type==='sort') sortedSteps.value=[...props.task.steps].sort(()=>Math.random()-0.5) }
function handleComplete(){ const t=taskStore.completeTask(props.task.id); if(t) knowledgeStore.unlockNodes(t.rewardKnowledgeIds); emit('completed',props.task) }
</script>
<style scoped>
.drawer-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.35); backdrop-filter: blur(4px); display: flex; align-items: flex-end; justify-content: center; }
.drawer { background: var(--bg-card); border-radius: 28px 28px 0 0; width: 100%; max-width: 560px; max-height: 85vh; overflow-y: auto; padding: 28px; position: relative; animation: slideUp 0.3s ease; box-shadow: 0 -8px 40px rgba(123,97,255,0.12); }
@keyframes slideUp { from{transform:translateY(100%)}to{transform:translateY(0)} }
.close-btn { position: absolute; top: 16px; right: 16px; width: 34px; height: 34px; border-radius: 50%; background: var(--primary-bg); font-size: 1rem; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
.drawer-header h2 { font-size: 1.25rem; margin: 10px 0 6px; font-weight: 800; }
.drawer-header p { color: var(--text-secondary); font-size: 0.9rem; }
.done-state { text-align: center; padding: 32px 0; }
.done-icon { font-size: 3.5rem; margin-bottom: 12px; }
.done-badge { color: #B8860B; font-weight: 800; margin-top: 8px; }
.question-text { font-size: 1.05rem; font-weight: 700; margin-bottom: 18px; }
.options-grid { display: flex; flex-direction: column; gap: 10px; }
.opt-btn { padding: 15px 18px; border-radius: var(--radius-md); background: var(--bg-section); font-size: 0.95rem; font-weight: 700; text-align: left; transition: all 0.25s; border: 2px solid transparent; color: var(--text-primary); }
.opt-btn.selected { border-color: var(--primary); background: var(--primary-bg); }
.opt-btn.correct { border-color: var(--dopa-cyan); background: #E6FFF5; }
.opt-btn.wrong { border-color: var(--dopa-red); background: #FFE8EE; }
.opt-btn:disabled { opacity: 0.7; }
.image-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.img-opt { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 18px 12px; }
.img-emoji { font-size: 2.8rem; margin-bottom: 8px; }
.sort-area { display: flex; flex-direction: column; gap: 8px; }
.sort-item { display: flex; align-items: center; gap: 10px; padding: 14px; background: var(--bg-section); border-radius: var(--radius-md); }
.sort-num { width: 30px; height: 30px; border-radius: 50%; background: var(--grad-hero); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; flex-shrink: 0; }
.sort-text { flex: 1; font-weight: 700; font-size: 0.9rem; }
.sort-btns { display: flex; gap: 4px; }
.sort-btns button { width: 34px; height: 34px; border-radius: var(--radius-sm); background: var(--bg-card); font-size: 1rem; border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; }
.sort-btns button:disabled { opacity: 0.3; }
.action-bar { margin-top: 22px; text-align: center; }
.action-bar .btn:disabled { opacity: 0.4; }
.result-area { margin-top: 18px; text-align: center; }
.result-banner { padding: 16px; border-radius: var(--radius-md); font-weight: 800; font-size: 1.1rem; margin-bottom: 12px; }
.result-banner.correct { background: #E6FFF5; color: var(--dopa-cyan); }
.result-banner.wrong { background: #FFE8EE; color: var(--dopa-red); }
.explanation { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 18px; }
</style>
