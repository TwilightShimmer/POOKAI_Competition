<template>
  <div class="kt-list">
    <div v-if="!tree || !tree.length" style="padding:20px;text-align:center;color:var(--text-light)">
      知识树数据加载中...
    </div>
    <div v-for="(branch, bi) in tree" :key="branch.id" class="kt-card card"
      :style="{'border-left': '4px solid ' + colors[bi]}">
      <div class="kt-head" @click="toggle(branch.id)">
        <!-- Ring progress -->
        <div class="kt-ring">
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="20" fill="none" stroke="var(--gray)" stroke-width="5" transform="rotate(-90 26 26)"/>
            <circle cx="26" cy="26" r="20" fill="none" :stroke="colors[bi]" stroke-width="5"
              :stroke-dasharray="125.6" :stroke-dashoffset="125.6 * (1 - pct(bi)/100)"
              stroke-linecap="round" transform="rotate(-90 26 26)" style="transition:stroke-dashoffset .8s"/>
          </svg>
          <span class="kt-emoji">{{ branch.emoji }}</span>
        </div>
        <div class="kt-info">
          <strong>{{ branch.name }}</strong>
          <div class="kt-bar"><div class="kt-fill" :style="{width: pct(bi)+'%', background: colors[bi]}"></div></div>
          <span class="kt-sub">{{ uCount(bi) }} / {{ branch.children.length }} 知识点</span>
        </div>
        <div class="kt-right">
          <span class="kt-pct" :style="{color: colors[bi]}">{{ pct(bi) }}%</span>
          <span class="kt-arrow">{{ expanded === branch.id ? '▲' : '▼' }}</span>
        </div>
      </div>

      <!-- Children list -->
      <div v-if="expanded === branch.id" class="kt-children">
        <div v-for="c in branch.children" :key="c.id"
          :class="['kt-child', { lit: isLit(c.id) }]"
          @click.stop="$emit('selectNode', c)">
          <span v-if="isLit(c.id)" class="kt-dot" :style="{background: colors[bi]}">⭐</span>
          <span v-else class="kt-dot locked">🔒</span>
          <span class="kt-cname">{{ c.name }}</span>
          <span class="kt-cdesc">{{ c.desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  tree: { type: Array, default: () => [] },
  unlockedIds: { type: Array, default: () => [] }
})

defineEmits(['selectNode', 'selectParent'])

const colors = ['#FF9600', '#1CB0F6', '#58CC02', '#CE82FF', '#FF4B4B']
const expanded = ref(null)

function uCount(bi) {
  if (!props.tree[bi]) return 0
  return props.tree[bi].children.filter(c => props.unlockedIds.includes(c.id)).length
}

function pct(bi) {
  if (!props.tree[bi]) return 0
  const t = props.tree[bi].children.length
  return t ? Math.round(uCount(bi) / t * 100) : 0
}

function isLit(id) { return props.unlockedIds.includes(id) }

function toggle(id) { expanded.value = expanded.value === id ? null : id }
</script>

<style scoped>
.kt-list { display: flex; flex-direction: column; gap: 10px; }

.kt-card { cursor: pointer; padding: 14px; }

.kt-head { display: flex; align-items: center; gap: 12px; }

.kt-ring { position: relative; flex-shrink: 0; width: 52px; height: 52px; }
.kt-emoji { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 20px; }

.kt-info { flex: 1; min-width: 0; }
.kt-info strong { font-size: 15px; font-weight: 900; display: block; margin-bottom: 4px; color: var(--text); }
.kt-bar { height: 8px; background: var(--gray); border-radius: 4px; overflow: hidden; margin-bottom: 3px; }
.kt-fill { height: 100%; border-radius: 4px; transition: width 0.8s; }
.kt-sub { font-size: 11px; color: var(--text-muted); font-weight: 700; }

.kt-right { text-align: right; flex-shrink: 0; }
.kt-pct { font-size: 20px; font-weight: 900; display: block; }
.kt-arrow { font-size: 12px; color: var(--text-muted); }

/* Children */
.kt-children { margin-top: 12px; padding-top: 12px; border-top: 2px solid var(--gray); display: flex; flex-direction: column; gap: 6px; }

.kt-child {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px; border-radius: 12px;
  background: var(--gray-bg); cursor: pointer; transition: background 0.15s;
}
.kt-child:hover { background: var(--green-light); }
.kt-child.lit { background: var(--green-light); }

.kt-dot { font-size: 14px; width: 24px; text-align: center; flex-shrink: 0; }
.kt-dot.locked { opacity: 0.5; }

.kt-cname { font-size: 14px; font-weight: 800; color: var(--text); white-space: nowrap; }
.kt-cdesc { font-size: 12px; color: var(--text-light); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
