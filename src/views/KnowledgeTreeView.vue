<template>
  <div class="page tree-page">
    <section class="tree-shell card">
      <div class="tree-head">
        <div class="tree-copy">
          <router-link to="/knowledge" class="tree-back">返回知识页</router-link>
          <div class="mono-label">Knowledge Graph</div>
          <h1>知识图谱</h1>
          <p>
            用可拖拽的图谱查看知识点结构。悬停会高亮关联路径，点击叶子节点可以查看说明与关联题目。
          </p>
        </div>

        <div class="tree-metrics">
          <div class="metric-card">
            <span>已点亮节点</span>
            <strong>{{ totalLit }} / {{ totalAll }}</strong>
          </div>
          <div class="metric-card">
            <span>已激活分支</span>
            <strong>{{ activeBranchCount }} / {{ branchSummary.length }}</strong>
          </div>
        </div>
      </div>

      <div class="branch-legend">
        <div v-for="branch in branchSummary" :key="branch.id" class="legend-chip">
          <span class="legend-dot" :style="{ background: branch.color }"></span>
          <span class="legend-name">{{ branch.name }}</span>
          <span class="legend-count">{{ branch.unlocked }}/{{ branch.total }}</span>
        </div>
      </div>

      <div
        ref="canvasEl"
        class="graph-stage"
        @wheel.prevent="onWheel"
        @mousedown.prevent="startPan"
        @mousemove="movePan"
        @mouseup="endPan"
        @mouseleave="endPan"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend="onTouchEnd"
      >
        <svg :width="vw" :height="vh" class="g-svg">
          <defs>
            <filter
              v-for="c in filterColors"
              :key="c.id"
              :id="c.id"
              x="-120%"
              y="-120%"
              width="340%"
              height="340%"
            >
              <feGaussianBlur in="SourceGraphic" :stdDeviation="c.blur" result="b" />
              <feColorMatrix
                in="b"
                type="matrix"
                :values="`1 0 0 0 ${c.r}  0 1 0 0 ${c.g}  0 0 1 0 ${c.b}  0 0 0 18 -7`"
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g :transform="`translate(${pan.x},${pan.y}) scale(${zoom})`">
            <line
              v-for="e in edges"
              :key="e.id"
              :x1="nodes[e.s].x"
              :y1="nodes[e.s].y"
              :x2="nodes[e.t].x"
              :y2="nodes[e.t].y"
              :stroke="edgeStroke(e)"
              :stroke-width="edgeW(e)"
              :opacity="edgeOp(e)"
              stroke-linecap="round"
            />

            <g
              v-for="n in sortedNodes"
              :key="n.id"
              class="g-node"
              :style="{ cursor: n.type === 'child' ? 'pointer' : 'default' }"
              @mouseenter="hoveredId = n.id"
              @mouseleave="hoveredId = null"
              @click.stop="onNodeClick(n)"
            >
              <circle
                v-if="n.lit || hoveredId === n.id"
                :cx="n.x"
                :cy="n.y"
                :r="nodeR(n) * 2.8"
                :fill="n.color"
                :opacity="hoveredId === n.id ? 0.26 : 0.1"
                style="pointer-events:none"
              />
              <circle
                v-if="n.lit || hoveredId === n.id"
                :cx="n.x"
                :cy="n.y"
                :r="nodeR(n) * 1.65"
                :fill="n.color"
                :opacity="hoveredId === n.id ? 0.44 : 0.18"
                style="pointer-events:none"
              />

              <circle
                :cx="n.x"
                :cy="n.y"
                :r="nodeR(n)"
                :fill="nodeFill(n)"
                :stroke="nodeStroke(n)"
                :stroke-width="hoveredId === n.id ? 2 : 1"
                :opacity="nodeOp(n)"
                :filter="n.lit && hoveredId === n.id ? `url(#gf-${n.colorKey})` : undefined"
              />

              <text
                v-if="showLabel(n)"
                :x="n.x"
                :y="n.y + nodeR(n) + (n.type === 'root' ? 18 : n.type === 'parent' ? 15 : 12)"
                text-anchor="middle"
                :fill="labelColor(n)"
                :font-size="n.type === 'root' ? 11 : n.type === 'parent' ? 9 : 8"
                font-weight="600"
                font-family="system-ui, sans-serif"
                style="pointer-events:none; user-select:none"
                :opacity="nodeOp(n)"
              >
                {{ n.label }}
              </text>
            </g>
          </g>
        </svg>

        <div class="stage-hint">拖动画布平移，滚轮缩放，点击节点查看详情</div>

        <div class="g-zoom">
          <button class="gz-btn" @click.stop="zoomBy(0.15)">+</button>
          <span class="gz-pct">{{ Math.round(zoom * 100) }}%</span>
          <button class="gz-btn" @click.stop="zoomBy(-0.15)">−</button>
          <button class="gz-btn gz-reset" @click.stop="resetView" title="重置视角">↺</button>
        </div>

        <div v-if="simActive" class="g-simhint">布局整理中</div>
      </div>
    </section>

    <Transition name="sheet">
      <div v-if="selected" class="g-sheet-bg" @click.self="selected = null">
        <div class="g-sheet">
          <div class="g-sheet-top">
            <div class="g-sheet-icon" :style="{ background: `${selected.color}20`, color: selected.color }">
              {{ selected.lit ? 'ON' : 'OFF' }}
            </div>

            <div class="g-sheet-main">
              <div class="mono-label">Node Detail</div>
              <h3>{{ selected.name }}</h3>
              <span class="g-sheet-parent" :style="{ color: selected.color }">{{ selected.parentName }}</span>
            </div>

            <button class="g-sheet-close" @click="selected = null">×</button>
          </div>

          <p class="g-sheet-desc">{{ selected.desc }}</p>

          <div class="g-sheet-status" :class="selected.lit ? 'lit' : 'locked'">
            {{ selected.lit ? '当前节点已点亮' : '答对相关题目后可点亮此节点' }}
          </div>

          <div v-if="selected.questionIds?.length" class="g-sheet-qids">
            <span class="g-sheet-qlabel">关联题目</span>
            <span v-for="q in selected.questionIds.slice(0, 8)" :key="q" class="g-sheet-q">Q{{ q }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { knowledgeTree } from '@/mock/knowledge.js'
import { useKnowledgeStore } from '@/stores/knowledge.js'

const ks = useKnowledgeStore()
const treeData = knowledgeTree

const COLORS = ['#ff9f0a', '#2383e2', '#2fb46c', '#7c5cff', '#e5484d']
const COLOR_KEYS = ['orange', 'blue', 'green', 'purple', 'red']

const filterColors = COLORS.map((c, i) => {
  const r = parseInt(c.slice(1, 3), 16) / 255
  const g = parseInt(c.slice(3, 5), 16) / 255
  const b = parseInt(c.slice(5, 7), 16) / 255
  return { id: `gf-${COLOR_KEYS[i]}`, blur: 5, r, g, b }
})

const canvasEl = ref(null)
const vw = ref(0)
const vh = ref(0)
let resizeObserver = null

const nodes = ref([])
const edges = ref([])
let phys = []
let physEd = []

const hoveredId = ref(null)
const selected = ref(null)
const zoom = ref(0.92)
const pan = ref({ x: 0, y: 0 })
const simActive = ref(false)

let rafId = null
let simTick = 0

function measureCanvas() {
  if (!canvasEl.value) return
  vw.value = Math.max(320, canvasEl.value.clientWidth)
  vh.value = Math.max(520, canvasEl.value.clientHeight)
}

function buildGraph() {
  if (!vw.value || !vh.value) return

  const cx = vw.value / 2
  const cy = vh.value / 2
  const nd = []
  const ed = []
  phys = []
  physEd = []

  nd.push({
    id: 'root',
    type: 'root',
    label: '知识图谱',
    name: '知识图谱',
    desc: '',
    color: '#2fb46c',
    colorKey: 'green',
    lit: true,
    x: cx,
    y: cy,
  })
  phys.push({ x: cx, y: cy, vx: 0, vy: 0 })

  let ni = 1
  treeData.forEach((branch, bi) => {
    const angle = (bi / treeData.length) * Math.PI * 2 - Math.PI / 2
    const initR = Math.min(vw.value, vh.value) * 0.24
    const px = cx + Math.cos(angle) * initR
    const py = cy + Math.sin(angle) * initR
    const hasLit = branch.children.some((c) => ks.isUnlocked(c.id))

    nd.push({
      id: branch.id,
      type: 'parent',
      label: branch.name,
      name: branch.name,
      desc: branch.description || '',
      emoji: branch.emoji,
      color: COLORS[bi],
      colorKey: COLOR_KEYS[bi],
      lit: hasLit,
      x: px + jitter(),
      y: py + jitter(),
    })
    phys.push({ x: nd[ni].x, y: nd[ni].y, vx: 0, vy: 0 })

    physEd.push({ s: 0, t: ni, k: 0.03, rest: Math.min(vw.value, vh.value) * 0.24 })
    ed.push({ id: `e-root-${branch.id}`, s: 0, t: ni, colorKey: COLOR_KEYS[bi] })

    const parentIndex = ni
    ni++

    branch.children.forEach((child, ci) => {
      const n = branch.children.length
      const fan = Math.min(Math.PI * 0.9, 0.5 + n * 0.1)
      const childAngle = angle - fan / 2 + (ci / Math.max(n - 1, 1)) * fan
      const ring = Math.floor(ci / 6)
      const cr = Math.min(vw.value, vh.value) * (0.14 + ring * 0.09)

      nd.push({
        id: child.id,
        type: 'child',
        label: child.name,
        name: child.name,
        desc: child.desc || '',
        questionIds: child.questionIds || [],
        parentName: branch.name,
        color: COLORS[bi],
        colorKey: COLOR_KEYS[bi],
        lit: ks.isUnlocked(child.id),
        x: px + Math.cos(childAngle) * cr + jitter(),
        y: py + Math.sin(childAngle) * cr + jitter(),
      })
      phys.push({ x: nd[ni].x, y: nd[ni].y, vx: 0, vy: 0 })

      physEd.push({ s: parentIndex, t: ni, k: 0.04, rest: Math.min(vw.value, vh.value) * 0.14 })
      ed.push({ id: `e-${branch.id}-${child.id}`, s: parentIndex, t: ni, colorKey: COLOR_KEYS[bi] })
      ni++
    })
  })

  nodes.value = nd
  edges.value = ed
}

function jitter() {
  return (Math.random() - 0.5) * 40
}

const REPEL = 4500
const GRAVITY = 0.006
const DAMP = 0.82
const MAX_VEL = 14

function forceTick() {
  const count = phys.length
  const cx = vw.value / 2
  const cy = vh.value / 2
  const fx = new Float32Array(count)
  const fy = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const dx = phys[j].x - phys[i].x
      const dy = phys[j].y - phys[i].y
      const d2 = Math.max(dx * dx + dy * dy, 1)
      const d = Math.sqrt(d2)
      const f = REPEL / d2
      fx[i] -= (f * dx) / d
      fy[i] -= (f * dy) / d
      fx[j] += (f * dx) / d
      fy[j] += (f * dy) / d
    }
  }

  physEd.forEach((e) => {
    const dx = phys[e.t].x - phys[e.s].x
    const dy = phys[e.t].y - phys[e.s].y
    const d = Math.sqrt(dx * dx + dy * dy) || 1
    const f = e.k * (d - e.rest)
    fx[e.s] += (f * dx) / d
    fy[e.s] += (f * dy) / d
    fx[e.t] -= (f * dx) / d
    fy[e.t] -= (f * dy) / d
  })

  for (let i = 0; i < count; i++) {
    fx[i] += GRAVITY * (cx - phys[i].x)
    fy[i] += GRAVITY * (cy - phys[i].y)
  }

  let maxV = 0
  for (let i = 0; i < count; i++) {
    phys[i].vx = (phys[i].vx + fx[i]) * DAMP
    phys[i].vy = (phys[i].vy + fy[i]) * DAMP
    const v = Math.sqrt(phys[i].vx ** 2 + phys[i].vy ** 2)
    if (v > MAX_VEL) {
      phys[i].vx *= MAX_VEL / v
      phys[i].vy *= MAX_VEL / v
    }
    phys[i].x += phys[i].vx
    phys[i].y += phys[i].vy
    nodes.value[i].x = phys[i].x
    nodes.value[i].y = phys[i].y
    maxV = Math.max(maxV, v)
  }

  return maxV
}

function runSim() {
  const maxV = forceTick()
  simTick++
  if (maxV > 0.25 && simTick < 600) {
    rafId = requestAnimationFrame(runSim)
  } else {
    simActive.value = false
  }
}

function startSim() {
  if (rafId) cancelAnimationFrame(rafId)
  simActive.value = true
  simTick = 0
  phys.forEach((p) => {
    p.vx = (Math.random() - 0.5) * 2
    p.vy = (Math.random() - 0.5) * 2
  })
  rafId = requestAnimationFrame(runSim)
}

function rebuildGraph() {
  measureCanvas()
  buildGraph()
  startSim()
}

const hoveredNeighborIds = computed(() => {
  if (!hoveredId.value) return new Set()
  const linked = new Set()
  edges.value.forEach((e) => {
    const sid = nodes.value[e.s]?.id
    const tid = nodes.value[e.t]?.id
    if (sid === hoveredId.value) linked.add(tid)
    if (tid === hoveredId.value) linked.add(sid)
  })
  return linked
})

const sortedNodes = computed(() =>
  [...nodes.value].sort((a, b) => {
    const aScore = (a.lit ? 1 : 0) + (a.type === 'root' ? 3 : a.type === 'parent' ? 2 : 0)
    const bScore = (b.lit ? 1 : 0) + (b.type === 'root' ? 3 : b.type === 'parent' ? 2 : 0)
    return aScore - bScore
  })
)

const branchSummary = computed(() =>
  treeData.map((branch, index) => ({
    id: branch.id,
    name: branch.name,
    color: COLORS[index],
    total: branch.children.length,
    unlocked: branch.children.filter((child) => ks.isUnlocked(child.id)).length,
  }))
)

const totalAll = computed(() => nodes.value.filter((n) => n.type === 'child').length)
const totalLit = computed(() => nodes.value.filter((n) => n.type === 'child' && n.lit).length)
const activeBranchCount = computed(() => branchSummary.value.filter((branch) => branch.unlocked > 0).length)

function nodeR(n) {
  const base = n.type === 'root' ? 18 : n.type === 'parent' ? (n.lit ? 13 : 8) : n.lit ? 7 : 4
  return hoveredId.value === n.id ? base * 1.3 : base
}

function nodeFill(n) {
  if (!n.lit) return 'rgba(255,255,255,0.12)'
  return n.color
}

function nodeStroke(n) {
  if (!n.lit) return 'rgba(255,255,255,0.18)'
  return n.type === 'root' ? '#7fe39d' : n.color
}

function nodeOp(n) {
  if (!hoveredId.value) return 1
  if (n.id === hoveredId.value || hoveredNeighborIds.value.has(n.id)) return 1
  return 0.14
}

function labelColor(n) {
  if (n.id === hoveredId.value) return '#ffffff'
  if (!n.lit) return 'rgba(255,255,255,0.34)'
  return 'rgba(255,255,255,0.86)'
}

function showLabel(n) {
  if (n.type === 'root' || n.type === 'parent') return true
  return n.lit || n.id === hoveredId.value || hoveredNeighborIds.value.has(n.id)
}

function edgeOp(e) {
  const sid = nodes.value[e.s]?.id
  const tid = nodes.value[e.t]?.id
  if (!hoveredId.value) return 0.18
  if (sid === hoveredId.value || tid === hoveredId.value) return 0.7
  return 0.05
}

function edgeStroke(e) {
  if (!hoveredId.value) return 'rgba(255,255,255,0.46)'
  const sid = nodes.value[e.s]?.id
  const tid = nodes.value[e.t]?.id
  if (sid === hoveredId.value || tid === hoveredId.value) {
    return COLORS[COLOR_KEYS.indexOf(e.colorKey)] || '#ffffff'
  }
  return 'rgba(255,255,255,0.22)'
}

function edgeW(e) {
  if (!hoveredId.value) return 1
  const sid = nodes.value[e.s]?.id
  const tid = nodes.value[e.t]?.id
  return sid === hoveredId.value || tid === hoveredId.value ? 1.8 : 0.8
}

function onNodeClick(node) {
  if (node.type === 'child') selected.value = node
}

function zoomBy(delta) {
  zoom.value = Math.max(0.2, Math.min(3, zoom.value + delta))
}

function resetView() {
  zoom.value = 0.92
  pan.value = { x: 0, y: 0 }
}

function onWheel(e) {
  zoomBy(e.deltaY > 0 ? -0.1 : 0.1)
}

let isPanning = false
let panOrigin = { x: 0, y: 0 }
let panBase = { x: 0, y: 0 }

function startPan(e) {
  if (e.target.closest('.g-node,.g-zoom')) return
  isPanning = true
  panOrigin = { x: e.clientX, y: e.clientY }
  panBase = { x: pan.value.x, y: pan.value.y }
}

function movePan(e) {
  if (!isPanning) return
  pan.value.x = panBase.x + e.clientX - panOrigin.x
  pan.value.y = panBase.y + e.clientY - panOrigin.y
}

function endPan() {
  isPanning = false
}

let touchOrigin = null

function onTouchStart(e) {
  if (e.touches.length !== 1) return
  touchOrigin = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  panBase = { x: pan.value.x, y: pan.value.y }
}

function onTouchMove(e) {
  if (!touchOrigin || e.touches.length !== 1) return
  pan.value.x = panBase.x + e.touches[0].clientX - touchOrigin.x
  pan.value.y = panBase.y + e.touches[0].clientY - touchOrigin.y
}

function onTouchEnd() {
  touchOrigin = null
}

function handleResize() {
  rebuildGraph()
}

onMounted(async () => {
  await nextTick()
  rebuildGraph()
  window.addEventListener('resize', handleResize)

  if (window.ResizeObserver && canvasEl.value) {
    resizeObserver = new ResizeObserver(() => {
      rebuildGraph()
    })
    resizeObserver.observe(canvasEl.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (rafId) cancelAnimationFrame(rafId)
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<style scoped>
.tree-page {
  animation: fadeSlideUp 0.32s ease;
}

.tree-shell {
  padding-bottom: 18px;
}

.tree-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 18px;
  align-items: end;
  margin-bottom: 16px;
}

.tree-back {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  margin-bottom: 14px;
  background: rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.06);
  color: var(--text-light);
  text-decoration: none;
  font-size: 0.84rem;
  font-weight: 600;
}

.tree-copy h1 {
  margin: 8px 0 10px;
  font-size: var(--page-title-size);
  letter-spacing: -0.05em;
}

.tree-copy p {
  max-width: 720px;
  color: var(--text-light);
  line-height: 1.75;
}

.tree-metrics {
  display: grid;
  gap: 10px;
}

.metric-card {
  padding: 16px;
  border-radius: 20px;
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(0,0,0,0.06);
}

.metric-card span {
  display: block;
  margin-bottom: 10px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: var(--ls-mono);
  text-transform: uppercase;
  color: var(--text-muted);
}

.metric-card strong {
  font-size: 1.2rem;
  font-weight: 650;
}

.branch-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.legend-chip {
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.72);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-name {
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--text);
}

.legend-count {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
}

.graph-stage {
  position: relative;
  min-height: clamp(520px, 72vh, 780px);
  border-radius: 28px;
  overflow: hidden;
  cursor: grab;
  background:
    radial-gradient(circle at 20% 20%, rgba(35,131,226,0.18) 0%, transparent 24%),
    radial-gradient(circle at 80% 22%, rgba(124,92,255,0.16) 0%, transparent 24%),
    radial-gradient(circle at 52% 88%, rgba(47,180,108,0.12) 0%, transparent 24%),
    linear-gradient(180deg, #0e1318 0%, #111821 100%);
  border: 1px solid rgba(0,0,0,0.16);
}

.graph-stage:active {
  cursor: grabbing;
}

.g-svg {
  display: block;
}

.stage-hint,
.g-simhint {
  position: absolute;
  left: 18px;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-size: 0.74rem;
  font-weight: 600;
  backdrop-filter: blur(16px);
}

.stage-hint {
  top: 18px;
  color: rgba(255,255,255,0.72);
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
}

.g-simhint {
  top: 58px;
  color: rgba(255,255,255,0.56);
  background: rgba(0,0,0,0.22);
}

.g-zoom {
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border-radius: 14px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(14px);
}

.gz-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: rgba(255,255,255,0.72);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.gz-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.gz-pct {
  min-width: 40px;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: rgba(255,255,255,0.72);
}

.gz-reset {
  color: rgba(255,255,255,0.9);
}

.g-sheet-bg {
  position: fixed;
  inset: 0;
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(8, 10, 14, 0.42);
  backdrop-filter: blur(10px);
}

.g-sheet {
  width: min(100%, 520px);
  padding: 20px;
  border-radius: 28px;
  background: rgba(255,255,255,0.96);
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: var(--shadow-lg);
}

.g-sheet-top {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
}

.g-sheet-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}

.g-sheet-main h3 {
  margin: 6px 0 4px;
  font-size: 1.28rem;
}

.g-sheet-parent {
  font-size: 0.84rem;
  font-weight: 600;
}

.g-sheet-close {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 12px;
  background: rgba(0,0,0,0.04);
  color: var(--text-light);
  font-size: 18px;
  cursor: pointer;
}

.g-sheet-desc {
  margin: 16px 0 14px;
  color: var(--text-light);
  line-height: 1.72;
}

.g-sheet-status {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  font-size: 0.86rem;
  font-weight: 600;
}

.g-sheet-status.lit {
  background: rgba(47,180,108,0.12);
  color: var(--green-dark);
}

.g-sheet-status.locked {
  background: rgba(255,159,10,0.12);
  color: #9a6200;
}

.g-sheet-qids {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
}

.g-sheet-qlabel {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: var(--ls-mono);
  text-transform: uppercase;
  color: var(--text-muted);
}

.g-sheet-q {
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: rgba(35,131,226,0.1);
  color: var(--blue-dark);
  font-size: 0.74rem;
  font-weight: 700;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.2s ease;
}

.sheet-enter-active .g-sheet,
.sheet-leave-active .g-sheet {
  transition: transform 0.22s ease, opacity 0.22s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .g-sheet,
.sheet-leave-to .g-sheet {
  transform: translateY(18px) scale(0.98);
  opacity: 0;
}

@media (max-width: 920px) {
  .tree-head {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .g-sheet-bg {
    align-items: end;
    padding: 0;
  }

  .g-sheet {
    width: 100%;
    border-radius: 26px 26px 0 0;
    padding-bottom: 28px;
  }

  .g-sheet-top {
    grid-template-columns: 52px minmax(0, 1fr);
  }

  .g-sheet-close {
    grid-column: 2;
    justify-self: end;
  }
}
</style>
