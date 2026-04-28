<template>
  <div :class="['task-card card', { done: task.status === 'done' }]" @click="$emit('select', task)">
    <div class="tc-color-bar" :style="{ background: barColor }"></div>
    <div class="task-top">
      <span :class="['badge-tag', diffClass]">{{ diffLabel }}</span>
      <span :class="['badge-tag', task.status === 'done' ? 'done' : 'locked']">
        {{ task.status === 'done' ? '✅ 已完成' : '⏳ 未完成' }}
      </span>
    </div>
    <div class="task-title">{{ task.title }}</div>
    <div class="task-desc">{{ task.shortDesc }}</div>
    <div class="task-bottom">
      <span class="task-type">{{ typeLabel }}</span>
      <span class="task-reward">🎁 {{ task.rewardKnowledgeIds.length }} 知识点</span>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ task: Object })
defineEmits(['select'])
const typeMap = { single: '单选题', image: '图片选择', sort: '步骤排序', judge: '场景判断' }
const typeLabel = computed(() => typeMap[props.task.type] || props.task.type)
const diffClass = computed(() => props.task.difficulty)
const diffLabel = computed(() => ({ easy: '简单', medium: '中等', hard: '困难' })[props.task.difficulty])
const barColor = computed(() => {
  if (props.task.status === 'done') return 'var(--grad-success)'
  return { easy: 'var(--dopa-cyan)', medium: 'var(--dopa-orange)', hard: 'var(--dopa-pink)' }[props.task.difficulty]
})
</script>
<style scoped>
.task-card { cursor: pointer; padding: 0; overflow: hidden; }
.tc-color-bar { height: 4px; width: 100%; }
.task-top { display: flex; gap: 8px; margin: 16px 16px 10px; flex-wrap: wrap; }
.task-title { font-size: 1.05rem; font-weight: 800; margin: 0 16px 6px; color: var(--text-primary); }
.task-desc { font-size: 0.85rem; color: var(--text-secondary); margin: 0 16px 12px; }
.task-bottom { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); padding: 0 16px 16px; }
.task-type {
  background: var(--primary-bg); color: var(--primary); padding: 3px 12px;
  border-radius: var(--radius-full); font-weight: 700;
}
.task-reward { font-weight: 700; color: #B8860B; }
</style>
