<template>
  <div class="home-page">
    <header class="home-header">
      <div class="container header-shell">
        <router-link to="/" class="brand-mark" aria-label="璞核首页">
          <img class="brand-logo" src="/宣传素材/logo.png" alt="璞核 Logo" />
          <span class="brand-copy">
            <strong>POOK CORE</strong>
            <small>赛事成长与 AI 陪伴平台</small>
          </span>
        </router-link>

        <nav class="header-nav" aria-label="首页导航">
          <a v-for="item in navItems" :key="item.href" :href="item.href">{{ item.label }}</a>
        </nav>

        <div class="header-actions">
          <router-link to="/theme-intro" class="header-link hide-mobile">赛事地图</router-link>
          <router-link to="/login" class="btn btn-ghost header-login">
            {{ userStore.isLoggedIn ? '账户' : '登录' }}
          </router-link>
          <router-link :to="primaryTo" class="btn btn-primary header-primary">
            {{ primaryLabel }}
          </router-link>
        </div>
      </div>
    </header>

    <main>
      <section id="home" class="hero-section">
        <div class="container">
          <div class="hero-intro">
            <span class="section-kicker">POOK CORE</span>
            <h1>用 AI 伙伴唤醒孩子的成长内核，让赛事成为真正的探索现场。</h1>
            <p>
              围绕自然语言编程、游戏化学习与持续陪伴成长，璞核把品牌官网、赛事主题、线下活动和产品服务组织成同一条清晰的成长路径。
            </p>
            <div class="hero-top-actions">
              <router-link :to="primaryTo" class="btn btn-primary btn-lg">{{ primaryLabel }}</router-link>
              <router-link to="/theme-intro" class="btn btn-ghost btn-lg">了解赛事主题</router-link>
            </div>
          </div>

          <section
            class="hero-carousel"
            aria-label="宣传走马灯"
            @mouseenter="stopHeroAutoplay"
            @mouseleave="startHeroAutoplay"
          >
            <button class="carousel-arrow left" type="button" aria-label="上一张" @click="prevHero">
              <span aria-hidden="true">‹</span>
            </button>

            <div class="hero-viewport">
              <div class="hero-track" :style="{ transform: `translateX(-${currentHero * 100}%)` }">
                <article
                  v-for="(slide, index) in heroSlides"
                  :key="slide.id"
                  :class="['hero-slide', { 'hero-slide-media-only': slide.showCopy === false }]"
                >
                  <div v-if="slide.showCopy !== false" class="hero-copy">
                    <span class="slide-kicker">{{ slide.kicker }}</span>
                    <h2>{{ slide.title }}</h2>
                    <p class="hero-description">{{ slide.description }}</p>

                    <ul class="hero-points">
                      <li v-for="point in slide.points" :key="point">{{ point }}</li>
                    </ul>
                  </div>

                  <div class="hero-media">
                    <div class="hero-media-frame">
                      <video
                        v-if="slide.mediaType === 'video'"
                        :ref="(el) => setHeroVideoRef(slide.id, el)"
                        class="hero-video"
                        :aria-label="slide.alt"
                        :src="heroVideoLoadState[slide.id] ? slide.video : undefined"
                        muted
                        playsinline
                        preload="metadata"
                        @canplay="handleHeroVideoCanPlay(slide.id)"
                        @ended="handleHeroVideoEnded(slide.id)"
                      ></video>
                      <img v-else :src="slide.image" :alt="slide.alt" decoding="async" />
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <button class="carousel-arrow right" type="button" aria-label="下一张" @click="nextHero">
              <span aria-hidden="true">›</span>
            </button>

            <div class="hero-controls">
              <div class="hero-dots" role="tablist" aria-label="选择宣传图">
                <button
                  v-for="(slide, index) in heroSlides"
                  :key="slide.id"
                  :class="['hero-dot', { active: index === currentHero }]"
                  :aria-label="`切换到第 ${index + 1} 张`"
                  :aria-selected="index === currentHero"
                  role="tab"
                  type="button"
                  @click="selectHero(index)"
                ></button>
              </div>
              <div class="hero-counter">{{ currentHero + 1 }} / {{ heroSlides.length }}</div>
            </div>
          </section>
        </div>
      </section>

      <section id="belief" class="section manifesto-section">
        <div class="container manifesto-shell">
          <div class="section-head">
            <span class="section-kicker">教育信念</span>
            <h2>不是工具，是伙伴。不是课程，是陪伴。不是灌输，是唤醒。</h2>
            <p>
              青少年不是被灌输知识的容器，而是自带探索本能的 AI 原住民。赛事只是入口，真正重要的是让好奇、提问、创造和解决能力持续发生。
            </p>
          </div>

          <div class="belief-grid">
            <article v-for="item in beliefCards" :key="item.title" class="belief-card">
              <div class="belief-icon" aria-hidden="true">{{ item.icon }}</div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </article>
          </div>

          <div class="theory-grid">
            <article v-for="item in theoryNotes" :key="item.title" class="theory-card">
              <span>{{ item.title }}</span>
              <p>{{ item.desc }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="product" class="section product-section">
        <div class="container">
          <div class="feature-split">
            <div class="feature-copy">
              <span class="section-kicker">产品体系</span>
              <h2>真实场景、AI 互动与赛事任务，共同组成孩子持续成长的产品体系。</h2>
              <p>
                从 AURA OS 到赛事主题，再到机构服务与未来创想学院，璞核把探索、协作与成长记录串联成完整体验。
              </p>

              <ul class="feature-list">
                <li v-for="item in productHighlights" :key="item">{{ item }}</li>
              </ul>

              <div class="feature-actions">
                <router-link to="/theme-intro" class="btn btn-primary btn-lg">浏览赛事主题</router-link>
                <router-link :to="primaryTo" class="btn btn-ghost btn-lg">进入系统</router-link>
              </div>
            </div>

            <div class="feature-media product-stage">
              <img src="/宣传素材/4.jpg" alt="POOK AURA OS 互动玩学应用示意图" decoding="async" />
            </div>
          </div>

          <div class="pillar-grid">
            <article v-for="item in pillars" :key="item.title" class="pillar-card">
              <div class="pillar-figure">
                <img :src="item.image" :alt="`${item.title}宣传图`" decoding="async" />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="section collage-section">
        <div class="container">
          <div class="section-head compact">
            <span class="section-kicker">赛事现场</span>
            <h2>从课堂体验到成果展示，让每一场赛事活动都能被一眼看懂。</h2>
            <p>通过真实现场、主题视觉与产品画面，呈现赛事活动的温度、氛围与执行力。</p>
          </div>

          <div class="collage-layout">
            <article class="collage-main">
              <img src="/宣传素材/3.jpg" alt="POOK AI 未来创想学院线下开课现场" decoding="async" />
              <div class="collage-main-copy">
                <span>Event Moments</span>
                <h3>课堂、营地与任务协作在同一现场展开，孩子的探索过程一目了然。</h3>
                <p>真实活动场景既能传达孩子的参与状态，也能让合作伙伴快速理解璞核能够落地的组织与执行能力。</p>
              </div>
            </article>

            <div class="collage-side">
              <article v-for="item in collageCards" :key="item.title" class="collage-card">
                <div class="collage-thumb">
                  <img :src="item.image" :alt="item.title" decoding="async" />
                </div>
                <div class="collage-copy">
                  <span>{{ item.eyebrow }}</span>
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.desc }}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="section compare-section">
        <div class="container">
          <div class="section-head compact">
            <span class="section-kicker">差异化对比</span>
            <h2>璞核 vs 传统教育</h2>
            <p>从驱动力、任务设计到成长机制，清晰看见璞核教育与传统教育的不同。</p>
          </div>

          <div class="compare-panel">
            <div class="compare-head">
              <div>传统教育</div>
              <div>璞核教育</div>
            </div>

            <div class="compare-body">
              <div v-for="item in comparisonRows" :key="item.traditional" class="compare-row">
                <div class="compare-old">{{ item.traditional }}</div>
                <div class="compare-new">{{ item.pook }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section audience-section">
        <div class="container">
          <div class="section-head compact">
            <span class="section-kicker">三方价值</span>
            <h2>对孩子、家长和合作伙伴，给出三条同样清楚的价值路径。</h2>
          </div>

          <div class="audience-grid">
            <article v-for="item in audiences" :key="item.title" class="audience-card">
              <div class="audience-media">
                <img :src="item.image" :alt="item.title" decoding="async" />
              </div>
              <div class="audience-copy">
                <span class="audience-label">{{ item.label }}</span>
                <h3>{{ item.title }}</h3>
                <ul>
                  <li v-for="point in item.points" :key="point">{{ point }}</li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="about" class="section promise-section">
        <div class="container promise-layout">
          <article class="promise-cover">
            <span class="section-kicker">品牌承诺</span>
            <h2>我们坚持长期真诚陪伴，也反对只追求短期结果的教育方式。</h2>
            <p>
              这一部分展示的是璞核的品牌立场，让家长、机构和合作伙伴清楚知道我们坚持什么，也明确反对什么。
            </p>
          </article>

          <div class="promise-columns">
            <article class="promise-card good">
              <h3>我们坚持</h3>
              <ul>
                <li v-for="item in promiseKeep" :key="item">{{ item }}</li>
              </ul>
            </article>

            <article class="promise-card bad">
              <h3>我们反对</h3>
              <ul>
                <li v-for="item in promiseAvoid" :key="item">{{ item }}</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section id="service" class="section service-section">
        <div class="container">
          <div class="cta-panel">
            <div class="cta-copy">
              <span class="section-kicker section-kicker-light">赛事服务</span>
              <h2>准备好唤醒孩子的成长内核了吗？</h2>
              <p>为学校、馆校空间、课程品牌与活动主办方提供可组合的赛事主题、产品能力与线下执行支持。</p>
            </div>
            <div class="cta-actions">
              <router-link :to="primaryTo" class="btn btn-primary btn-lg cta-primary">{{ primaryLabel }}</router-link>
              <router-link to="/login?role=org" class="btn btn-ghost btn-lg cta-ghost">了解合作</router-link>
            </div>
          </div>

          <div class="service-grid">
            <article v-for="item in serviceCards" :key="item.title" class="service-card">
              <div class="service-media">
                <img :src="item.image" :alt="item.title" decoding="async" />
              </div>
              <div class="service-copy">
                <span>{{ item.label }}</span>
                <h3>{{ item.title }}</h3>
                <p>{{ item.desc }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>

    <footer class="home-footer">
      <div class="container footer-shell">
        <div class="footer-brand">
          <div class="footer-brand-mark">
            <img src="/宣传素材/logo.png" alt="璞核 Logo" decoding="async" />
            <div>
              <strong>璞核 POOK CORE</strong>
              <span>让每个孩子成为 AI 时代的创造者</span>
            </div>
          </div>

          <div class="footer-social">
            <span>微信</span>
            <span>微博</span>
          </div>
        </div>

        <div class="footer-links">
          <div class="footer-column">
            <strong>关于</strong>
            <a href="#about">关于我们</a>
            <a href="#belief">品牌承诺</a>
            <a href="#service">未来创想学院</a>
          </div>

          <div class="footer-column">
            <strong>产品</strong>
            <a href="#product">产品体系</a>
            <router-link to="/theme-intro">赛事主题</router-link>
            <a href="#service">赛事服务</a>
          </div>

          <div class="footer-column">
            <strong>联系</strong>
            <router-link to="/login">立即体验</router-link>
            <router-link to="/login?role=org">合作咨询</router-link>
            <router-link :to="primaryTo">进入系统</router-link>
          </div>
        </div>

        <div class="footer-bottom">
          <span>© 2026 璞核 POOK CORE. All rights reserved.</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()

const primaryTo = computed(() => {
  if (!userStore.isLoggedIn) return '/login'
  return {
    student: userStore.inviteCode && userStore.themeContentReady ? '/tasks' : '/student',
    org: '/org',
    platform: '/platform',
  }[userStore.currentRole] || '/login'
})

const primaryLabel = computed(() => {
  if (!userStore.isLoggedIn) return '立即体验'
  return {
    student: '进入学生端',
    org: '进入机构端',
    platform: '进入平台运营端',
  }[userStore.currentRole] || '进入系统'
})

const navItems = [
  { href: '#home', label: '首页' },
  { href: '#belief', label: '产品理念' },
  { href: '#product', label: '产品体系' },
  { href: '#about', label: '关于我们' },
  { href: '#service', label: '赛事服务' },
]

const heroSlides = [
  {
    id: 'hero-video',
    mediaType: 'video',
    showCopy: false,
    video: '/宣传素材/宣传视频.mp4',
    kicker: 'POOK VIDEO',
    title: '看见孩子在真实任务中探索、协作与成长',
    description: '首屏视频呈现课堂、营地与赛事现场的真实片段，帮助你快速了解璞核的学习氛围与成长体验。',
    points: ['真实学习现场', 'AI 陪伴探索', '赛事成长体验'],
    alt: 'POOK AI 首页首屏宣传视频',
  },
  {
    id: 'hero-core',
    mediaType: 'image',
    image: '/宣传素材/1.png',
    kicker: 'POOK CORE',
    title: '每个孩子都有一颗璞玉般的内核，等待觉醒',
    description: '用 AI 伙伴唤醒孩子的成长内核，把赛事、项目和长期陪伴组织成一条清晰的成长路径。',
    points: ['自然语言编程', '游戏化学习', '持续陪伴成长'],
    alt: 'POOK AI 宣传图一，展示璞核 AI 伙伴与成长场景',
  },
  {
    id: 'hero-partner',
    mediaType: 'image',
    image: '/宣传素材/2.png',
    kicker: 'AI PARTNER',
    title: '不是工具，是伙伴；不是课程，是陪伴',
    description: '赛事不再只是一次性活动，而是孩子主动探索、提问和表达的开始。',
    points: ['个性化引导', '互动式任务', '长期记忆系统'],
    alt: 'POOK AI 宣传图二，展示璞核 AI 伙伴与互动陪伴场景',
  },
  {
    id: 'hero-campus',
    mediaType: 'image',
    image: '/宣传素材/3.jpg',
    kicker: 'FUTURE ACADEMY',
    title: '把课堂、营地与赛事现场连成真实体验',
    description: '真实场景中的协作、动手与表达，让孩子在做中学，在探索中建立胜任感。',
    points: ['线下活动', '作品展示', '团队协作'],
    alt: 'POOK AI 未来创想学院线下开课现场',
  },
  {
    id: 'hero-aura',
    mediaType: 'image',
    image: '/宣传素材/4.jpg',
    kicker: 'AURA OS',
    title: '把视觉理解、场景互动和玩学应用，变成产品化能力底座',
    description: '围绕图像、记忆和互动反馈，构建适合赛事服务、课程交付与机构合作的系统能力。',
    points: ['视觉理解', '场景互动', '结构化记忆'],
    alt: 'POOK AURA OS 互动玩学应用示意图',
  },
]

const beliefCards = [
  { icon: '🔍', title: '好奇心', desc: '保持对世界的好奇，让赛事主题从题面走向主动探索。' },
  { icon: '💡', title: '提问力', desc: '学会提问，比立刻得到标准答案更重要。' },
  { icon: '🎨', title: '创造力', desc: '让作品输出成为赛事过程的一部分，而不是赛后附加项。' },
  { icon: '⚙️', title: '解决力', desc: '面对真实任务不退缩，用技术与协作解决具体问题。' },
]

const theoryNotes = [
  { title: '皮亚杰建构主义', desc: '通过与环境互动主动建构知识。' },
  { title: '杜威 教育即生活', desc: '把真实场景放进成长过程。' },
  { title: '德西 自我决定理论', desc: '让自主感、胜任感、归属感同时发生。' },
  { title: '维果茨基 最近发展区', desc: '让任务保持跳一跳够得着的挑战度。' },
]

const productHighlights = [
  '赛事主题、任务台与成长档案统一组织',
  'AURA OS 与 AI 伙伴形成互动闭环',
  '线下营地、课堂活动与机构服务协同呈现',
  '从报名体验到作品沉淀，沉淀长期成长记录',
]

const pillars = [
  {
    icon: '🌱',
    title: '成长',
    image: '/宣传素材/card1.png',
    points: ['可视化成长档案', '个性化成长路径', '体系化能力图谱', '长期陪伴见证'],
  },
  {
    icon: '🤝',
    title: '陪伴',
    image: '/宣传素材/card2.png',
    points: ['长期记忆系统', '情感化交互', '个性化对话', '受约束的智能体'],
  },
  {
    icon: '✨',
    title: '唤醒',
    image: '/宣传素材/card3.png',
    points: ['从要我学到我要学', '从模仿者到创造者', '从被动接受到主动探索', '从外在激励到内在驱动'],
  },
  {
    icon: '💡',
    title: '创造',
    image: '/宣传素材/card4.png',
    points: ['创造而非消费', '动手实践，从做中学', '开放式项目探索', '让想法变为现实'],
  },
]

const collageCards = [
  {
    eyebrow: '主题主视觉',
    title: '统一赛季主题表达',
    desc: '让首页、专题页和活动物料保持统一表达，帮助家长和合作伙伴更快理解赛事主题。',
    image: '/宣传素材/1.png',
  },
  {
    eyebrow: '互动陪伴',
    title: '让 AI 伙伴进入赛事叙事',
    desc: '用角色化形象承接任务引导、过程反馈和成长陪伴，降低孩子与家长的理解门槛。',
    image: '/宣传素材/2.png',
  },
  {
    eyebrow: '系统能力',
    title: '把产品能力做成看得见的服务',
    desc: '把视觉理解、场景互动和结构化记忆转成直观画面，让合作沟通更高效。',
    image: '/宣传素材/4.jpg',
  },
]

const comparisonRows = [
  { traditional: '外在激励（分数）', pook: '内在驱动（好奇）' },
  { traditional: '被动接受知识', pook: '主动探索问题' },
  { traditional: '标准化答案', pook: '开放式创造' },
  { traditional: '孤立学习', pook: '社交协作' },
  { traditional: '一次性课程', pook: '持续陪伴成长' },
]

const audiences = [
  {
    label: '对孩子',
    title: '第一台 AI 伙伴',
    image: '/宣传素材/1.png',
    points: ['零门槛编程', '游戏化学习', '在赛事中把兴趣转成作品'],
  },
  {
    label: '对家长',
    title: '看得见的成长',
    image: '/宣传素材/2.png',
    points: ['过程透明可理解', '知道孩子在学什么、做什么', '把 AI 变成时代入场券'],
  },
  {
    label: '对合作伙伴',
    title: '赛事服务与课程交付一体化',
    image: '/宣传素材/4.jpg',
    points: ['降低教学成本', '提升学员粘性', '形成差异化竞争力'],
  },
]

const promiseKeep = [
  '尊重每个孩子的独特性',
  '唤醒内在驱动力',
  '长期真诚陪伴',
  '创造者思维',
  '对孩子、家长、社会负责',
]

const promiseAvoid = [
  '灌输式教育',
  '标准化答案',
  '放纵式 AI',
  '黑盒算法',
  '只追求短期利益',
]

const serviceCards = [
  {
    label: '赛事主题',
    title: '主题赛事策划',
    desc: '围绕探月、火星、AI 创造等方向输出主题内容、任务结构和展示节点，方便快速落地专题活动。',
    image: '/宣传素材/1.png',
  },
  {
    label: '活动执行',
    title: '课堂、营地与路演支持',
    desc: '支持线下开课、营地工作坊、成果路演与展示传播，让赛事活动从报名到现场执行更完整。',
    image: '/宣传素材/3.jpg',
  },
  {
    label: '能力底座',
    title: 'AI 互动产品与平台接入',
    desc: '提供 AURA OS、互动玩学能力与平台入口，支撑主题任务、AI 反馈和持续成长记录。',
    image: '/宣传素材/4.jpg',
  },
]

const currentHero = ref(0)
const heroVideoRefs = new Map()
const heroVideoLoadState = ref({})
let heroTimer
let heroVideoLoadTimer
let heroAutoplayEnabled = true

function setHeroVideoRef(slideId, el) {
  if (el instanceof HTMLVideoElement) {
    heroVideoRefs.set(slideId, el)
    return
  }

  heroVideoRefs.delete(slideId)
}

function markHeroVideoForLoad(slideId) {
  if (heroVideoLoadState.value[slideId]) return

  heroVideoLoadState.value = {
    ...heroVideoLoadState.value,
    [slideId]: true,
  }
}

function stopHeroVideoLoadTimer() {
  if (heroVideoLoadTimer) {
    window.clearTimeout(heroVideoLoadTimer)
    heroVideoLoadTimer = undefined
  }
}

function scheduleCurrentHeroVideoLoad() {
  stopHeroVideoLoadTimer()

  const currentSlide = heroSlides[currentHero.value]
  if (!currentSlide || currentSlide.mediaType !== 'video') return
  if (heroVideoLoadState.value[currentSlide.id]) return

  heroVideoLoadTimer = window.setTimeout(() => {
    markHeroVideoForLoad(currentSlide.id)
    heroVideoLoadTimer = undefined
  }, 300)
}

function syncHeroMedia() {
  nextTick(() => {
    heroSlides.forEach((slide, index) => {
      if (slide.mediaType !== 'video') return

      const video = heroVideoRefs.get(slide.id)
      if (!video) return

      if (index === currentHero.value) {
        if (!heroVideoLoadState.value[slide.id]) {
          scheduleCurrentHeroVideoLoad()
          return
        }

        if (video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) return

        const playPromise = video.play()
        if (playPromise?.catch) playPromise.catch(() => {})
        return
      }

      video.pause()
      video.currentTime = 0
    })
  })
}

function queueHeroAutoplay() {
  stopHeroAutoplayTimer()

  if (!heroAutoplayEnabled) return

  const currentSlide = heroSlides[currentHero.value]
  if (!currentSlide) return

  if (currentSlide.mediaType === 'video') {
    scheduleCurrentHeroVideoLoad()
    const video = heroVideoRefs.get(currentSlide.id)
    if (video?.ended) {
      nextHero()
    }
    return
  }

  heroTimer = window.setTimeout(() => {
    nextHero()
  }, 6500)
}

function nextHero() {
  currentHero.value = (currentHero.value + 1) % heroSlides.length
}

function prevHero() {
  currentHero.value = (currentHero.value - 1 + heroSlides.length) % heroSlides.length
}

function selectHero(index) {
  currentHero.value = index
  startHeroAutoplay()
}

function stopHeroAutoplayTimer() {
  if (heroTimer) {
    window.clearTimeout(heroTimer)
    heroTimer = undefined
  }
}

function stopHeroAutoplay() {
  heroAutoplayEnabled = false
  stopHeroAutoplayTimer()
}

function startHeroAutoplay() {
  heroAutoplayEnabled = true
  queueHeroAutoplay()
}

function handleHeroVideoCanPlay(slideId) {
  const currentSlide = heroSlides[currentHero.value]
  if (!currentSlide || currentSlide.id !== slideId) return

  const video = heroVideoRefs.get(slideId)
  if (!video) return

  const playPromise = video.play()
  if (playPromise?.catch) playPromise.catch(() => {})
}

function handleHeroVideoEnded(slideId) {
  if (!heroAutoplayEnabled) return

  const currentSlide = heroSlides[currentHero.value]
  if (!currentSlide || currentSlide.id !== slideId) return

  nextHero()
}

onMounted(() => {
  startHeroAutoplay()
  syncHeroMedia()
})

onBeforeUnmount(() => {
  stopHeroVideoLoadTimer()
  stopHeroAutoplayTimer()
  heroVideoRefs.forEach((video) => video.pause())
})

watch(currentHero, () => {
  stopHeroVideoLoadTimer()
  syncHeroMedia()
  queueHeroAutoplay()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(225, 205, 176, 0.28) 0%, transparent 24%),
    linear-gradient(180deg, #fbf8f3 0%, #f7f3ec 42%, #ffffff 100%);
  color: #111111;
}

.home-page .container {
  max-width: 1380px;
  padding: 0 28px;
}

.home-header {
  position: sticky;
  top: 0;
  z-index: 80;
  border-bottom: 1px solid rgba(17, 17, 17, 0.06);
  background: rgba(251, 248, 243, 0.86);
  backdrop-filter: blur(16px);
}

.header-shell {
  min-height: 76px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 24px;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #111111;
  text-decoration: none;
}

.brand-logo {
  width: 44px;
  height: 44px;
  display: block;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 10px 24px rgba(17, 17, 17, 0.08);
}

.brand-copy {
  display: grid;
  gap: 2px;
}

.brand-copy strong {
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.brand-copy small {
  color: #726b5f;
  font-size: 0.72rem;
}

.header-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.header-nav a,
.header-link {
  padding: 10px 14px;
  border-radius: 999px;
  color: #5c564b;
  font-size: 0.92rem;
  text-decoration: none;
  transition: background 0.24s ease, color 0.24s ease;
}

.header-nav a:hover,
.header-link:hover {
  color: #111111;
  background: rgba(17, 17, 17, 0.05);
}

.header-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.header-login {
  background: rgba(255, 255, 255, 0.74);
  border-color: rgba(17, 17, 17, 0.08);
  box-shadow: none;
}

.header-primary {
  background: #111111;
  border-color: #111111;
  box-shadow: none;
}

.header-primary:hover {
  background: #000000;
  border-color: #000000;
}

.hero-section {
  padding: 44px 0 32px;
}

.hero-intro,
.section-head,
.promise-cover {
  max-width: 860px;
}

.section-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(17, 17, 17, 0.08);
  background: rgba(255, 255, 255, 0.8);
  color: #736b5f;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: var(--ls-mono);
  text-transform: uppercase;
}

.section-kicker-light {
  color: rgba(255, 255, 255, 0.76);
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
}

.hero-intro h1,
.section-head h2,
.feature-copy h2,
.promise-cover h2,
.cta-copy h2 {
  margin-top: 16px;
  line-height: 0.98;
  letter-spacing: -0.06em;
}

.hero-intro h1 {
  max-width: 920px;
  font-size: var(--page-title-size);
}

.hero-intro p,
.section-head p,
.belief-card p,
.theory-card p,
.feature-copy p,
.collage-main-copy p,
.collage-copy p,
.audience-copy li,
.promise-cover p,
.promise-card li,
.service-copy p {
  color: #6a6459;
  line-height: 1.78;
}

.hero-intro p {
  max-width: 780px;
  margin-top: 16px;
  font-size: 1rem;
}

.hero-top-actions,
.feature-actions,
.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}

.hero-carousel {
  position: relative;
  margin-top: 30px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 18px;
}

.carousel-arrow {
  width: 54px;
  height: 54px;
  border: 1px solid rgba(17, 17, 17, 0.08);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #111111;
  font-size: 1.9rem;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 16px 32px rgba(17, 17, 17, 0.08);
  transition: transform 0.24s ease, background 0.24s ease;
}

.carousel-arrow:hover {
  transform: translateY(-2px);
  background: #ffffff;
}

.hero-viewport {
  overflow: hidden;
  border-radius: 34px;
  border: 1px solid rgba(17, 17, 17, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 240, 232, 0.98) 100%);
  box-shadow: 0 34px 80px rgba(17, 17, 17, 0.08);
}

.hero-track {
  display: flex;
  transition: transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.hero-slide {
  min-width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 0.78fr) minmax(0, 1.22fr);
  gap: 28px;
  padding: 34px;
  align-items: center;
}

.hero-slide-media-only {
  grid-template-columns: minmax(0, 1fr);
}

.hero-copy {
  max-width: 480px;
}

.slide-kicker,
.audience-label,
.service-copy span,
.collage-copy span,
.collage-main-copy span {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: var(--ls-mono);
  text-transform: uppercase;
}

.slide-kicker {
  color: #7b7468;
}

.hero-copy h2 {
  margin-top: 14px;
  font-size: clamp(1.35rem, 1.85vw, 2.15rem);
  line-height: 1.04;
  letter-spacing: -0.06em;
}

.hero-description {
  margin-top: 14px;
}

.hero-points {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  list-style: none;
}

.hero-points li,
.feature-list li {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(17, 17, 17, 0.05);
  color: #22201b;
  font-size: 0.9rem;
}

.hero-media {
  display: flex;
  justify-content: flex-end;
}

.hero-slide-media-only .hero-media {
  justify-content: stretch;
}

.hero-media-frame {
  width: 100%;
  min-height: 560px;
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid rgba(17, 17, 17, 0.06);
  background: #efe7dc;
}

.hero-media-frame img,
.hero-media-frame video,
.feature-media img,
.pillar-figure img,
.collage-main img,
.collage-thumb img,
.audience-media img,
.service-media img,
.footer-brand-mark img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.hero-video {
  background: #0f0f10;
}

.hero-slide-media-only .hero-video {
  object-fit: contain;
}

.hero-controls {
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 18px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(17, 17, 17, 0.08);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 12px 30px rgba(17, 17, 17, 0.08);
}

.hero-dots {
  display: inline-flex;
  gap: 8px;
}

.hero-dot {
  width: 10px;
  height: 10px;
  border: none;
  border-radius: 50%;
  background: rgba(17, 17, 17, 0.18);
  cursor: pointer;
  transition: transform 0.24s ease, background 0.24s ease;
}

.hero-dot.active {
  background: #111111;
  transform: scale(1.2);
}

.hero-counter {
  color: #6b6458;
  font-size: 0.82rem;
  font-weight: 600;
}

.section {
  padding: 46px 0;
}

.section-head h2,
.feature-copy h2,
.promise-cover h2,
.cta-copy h2 {
  font-size: clamp(1.25rem, 1.75vw, 1.9rem);
}

.belief-card h3,
.pillar-title h3,
.collage-card h3,
.audience-copy h3,
.promise-card h3,
.service-card h3 {
  font-size: 1rem;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.section-head p {
  margin-top: 14px;
}

.compact {
  max-width: 920px;
}

.manifesto-section {
  background: rgba(255, 255, 255, 0.46);
}

.manifesto-shell {
  display: grid;
  gap: 24px;
}

.belief-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.belief-card,
.theory-card,
.pillar-card,
.audience-card,
.service-card {
  overflow: hidden;
  border: 1px solid rgba(17, 17, 17, 0.08);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 18px 48px rgba(17, 17, 17, 0.05);
}

.belief-card {
  padding: 26px 24px;
}

.belief-icon {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: rgba(17, 17, 17, 0.06);
  font-size: 1.35rem;
}

.belief-card h3,
.theory-card span,
.collage-card h3,
.promise-card h3,
.service-card h3 {
  margin-top: 18px;
}

.belief-card p,
.theory-card p {
  margin-top: 10px;
}

.theory-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.theory-card {
  padding: 22px;
}

.theory-card span {
  display: block;
  color: #171512;
  font-size: 0.94rem;
  font-weight: 600;
}

.product-section {
  background: linear-gradient(180deg, rgba(245, 240, 232, 0.78) 0%, rgba(255, 255, 255, 0.86) 100%);
}

.feature-split {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 22px;
  align-items: stretch;
}

.feature-copy {
  padding: 34px;
  border: 1px solid rgba(17, 17, 17, 0.08);
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 60px rgba(17, 17, 17, 0.06);
}

.feature-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
  list-style: none;
}

.feature-media {
  min-height: 620px;
  overflow: hidden;
  border-radius: 34px;
  border: 1px solid rgba(17, 17, 17, 0.08);
  background: #f5efe6;
  box-shadow: 0 26px 70px rgba(17, 17, 17, 0.06);
}

.pillar-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 24px;
}

.pillar-card {
  background: #f4ede2;
}

.pillar-figure {
  background: #f4ede2;
}

.pillar-figure img {
  height: auto;
  object-fit: contain;
}

.pillar-copy ul,
.audience-copy ul,
.promise-card ul {
  display: grid;
  gap: 10px;
  margin-top: 16px;
  list-style: none;
}

.pillar-copy li,
.audience-copy li,
.promise-card li {
  position: relative;
  padding-left: 16px;
}

.pillar-copy li::before,
.audience-copy li::before,
.promise-card li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.75em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(17, 17, 17, 0.3);
  transform: translateY(-50%);
}

.collage-section {
  background: #efe5d9;
}

.collage-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(0, 0.82fr);
  gap: 18px;
  margin-top: 24px;
}

.collage-main {
  position: relative;
  min-height: 640px;
  overflow: hidden;
  border-radius: 34px;
  border: 1px solid rgba(17, 17, 17, 0.08);
  box-shadow: 0 22px 60px rgba(17, 17, 17, 0.08);
}

.collage-main::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 24%, rgba(17, 17, 17, 0.6) 100%);
}

.collage-main-copy {
  position: absolute;
  left: 28px;
  right: 28px;
  bottom: 28px;
  z-index: 1;
  color: #ffffff;
}

.collage-main-copy span {
  color: rgba(255, 255, 255, 0.78);
}

.collage-main-copy h3 {
  margin-top: 12px;
  max-width: 680px;
  font-size: clamp(1.2rem, 1.55vw, 1.65rem);
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.collage-main-copy p {
  margin-top: 12px;
  max-width: 620px;
  color: rgba(255, 255, 255, 0.82);
}

.collage-side {
  display: grid;
  gap: 18px;
}

.collage-card {
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  gap: 16px;
  padding: 14px;
}

.collage-thumb {
  overflow: hidden;
  border-radius: 22px;
  background: #f3ecdf;
}

.collage-copy {
  padding: 10px 4px 10px 0;
}

.collage-copy span,
.service-copy span,
.audience-label {
  color: #7c7468;
}

.collage-copy p {
  margin-top: 10px;
}

.compare-section {
  background: rgba(255, 255, 255, 0.58);
}

.compare-panel {
  margin-top: 22px;
  overflow: hidden;
  border: 1px solid rgba(17, 17, 17, 0.08);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 22px 56px rgba(17, 17, 17, 0.05);
}

.compare-head,
.compare-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.compare-head {
  background: #f3ede4;
  font-size: 0.92rem;
  font-weight: 700;
}

.compare-head div,
.compare-row div {
  padding: 20px 24px;
}

.compare-head div:last-child,
.compare-row div:last-child {
  border-left: 1px solid rgba(17, 17, 17, 0.08);
}

.compare-row + .compare-row {
  border-top: 1px solid rgba(17, 17, 17, 0.08);
}

.compare-old {
  color: #71695d;
}

.compare-new {
  background: rgba(227, 209, 182, 0.2);
  color: #111111;
  font-weight: 600;
}

.audience-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 22px;
}

.audience-media {
  height: 240px;
  background: #f3ece2;
}

.audience-copy,
.service-copy {
  padding: 22px;
}

.audience-copy h3 {
  margin-top: 12px;
}

.promise-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 18px;
  align-items: start;
}

.promise-cover {
  padding: 34px;
  border: 1px solid rgba(17, 17, 17, 0.08);
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 22px 56px rgba(17, 17, 17, 0.05);
}

.promise-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.promise-card {
  padding: 28px;
  border: 1px solid rgba(17, 17, 17, 0.08);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 22px 56px rgba(17, 17, 17, 0.05);
}

.promise-card.good {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(243, 238, 230, 0.92) 100%);
}

.promise-card.bad {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(246, 239, 236, 0.92) 100%);
}

.service-section {
  padding-bottom: 64px;
}

.cta-panel {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 36px;
  border-radius: 36px;
  background: linear-gradient(135deg, #c97f28 0%, #e2a14a 48%, #f0c984 100%);
  box-shadow: 0 28px 68px rgba(166, 102, 26, 0.28);
}

.cta-copy {
  max-width: 760px;
  color: #ffffff;
}

.cta-copy p {
  margin-top: 14px;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.75;
}

.cta-primary {
  background: #ffffff;
  border-color: #ffffff;
  color: #9d6014;
}

.cta-primary:hover {
  background: #ffffff;
  border-color: #ffffff;
  color: #8a4f0b;
}

.cta-ghost {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  box-shadow: none;
}

.cta-ghost:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.42);
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 22px;
}

.service-media {
  height: 220px;
  background: #f2ebdf;
}

.home-footer {
  background: #111111;
  color: rgba(255, 255, 255, 0.78);
}

.footer-shell {
  display: grid;
  gap: 28px;
  padding-top: 48px;
  padding-bottom: 34px;
}

.footer-brand {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
}

.footer-brand-mark {
  display: flex;
  align-items: center;
  gap: 14px;
}

.footer-brand-mark img {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 50%;
}

.footer-brand-mark strong {
  display: block;
  margin: 0;
  font-size: 1.1rem;
  color: #ffffff;
  letter-spacing: -0.03em;
}

.footer-brand-mark span {
  display: block;
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.56);
}

.footer-social {
  display: inline-flex;
  gap: 10px;
}

.footer-social span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.footer-column {
  display: grid;
  gap: 12px;
}

.footer-column strong {
  color: #ffffff;
  font-size: 0.95rem;
}

.footer-column a {
  color: rgba(255, 255, 255, 0.66);
  text-decoration: none;
  transition: color 0.24s ease;
}

.footer-column a:hover {
  color: #ffffff;
}

.footer-bottom {
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.46);
  font-size: 0.88rem;
}

.hide-mobile {
  display: inline-flex;
}

@media (max-width: 1180px) {
  .header-nav {
    display: none;
  }

  .hero-slide,
  .feature-split,
  .collage-layout,
  .promise-layout {
    grid-template-columns: 1fr;
  }

  .hero-copy,
  .feature-copy,
  .promise-cover {
    max-width: none;
  }

  .hero-media {
    justify-content: stretch;
  }

  .hero-media-frame,
  .feature-media,
  .collage-main {
    min-height: 460px;
  }

  .belief-grid,
  .theory-grid,
  .pillar-grid,
  .audience-grid,
  .service-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .promise-columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .home-page .container {
    padding: 0 18px;
  }

  .header-shell {
    grid-template-columns: minmax(0, 1fr);
    justify-items: start;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .carousel-arrow {
    display: none;
  }

  .hero-carousel {
    grid-template-columns: 1fr;
  }

  .hero-slide {
    padding: 22px;
  }

  .hero-media-frame {
    min-height: 360px;
  }

  .hero-controls {
    position: static;
    margin: 16px auto 0;
    transform: none;
    width: fit-content;
  }

  .belief-grid,
  .theory-grid,
  .pillar-grid,
  .audience-grid,
  .service-grid,
  .footer-links {
    grid-template-columns: 1fr;
  }

  .collage-card {
    grid-template-columns: 1fr;
  }

  .collage-thumb {
    min-height: 220px;
  }

  .compare-head,
  .compare-row {
    grid-template-columns: 1fr;
  }

  .compare-head div:last-child,
  .compare-row div:last-child {
    border-left: none;
    border-top: 1px solid rgba(17, 17, 17, 0.08);
  }

  .cta-panel,
  .footer-brand {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 720px) {
  .hero-intro h1 {
    font-size: var(--page-title-size-mobile);
  }

  .hero-copy h2,
  .section-head h2,
  .feature-copy h2,
  .promise-cover h2,
  .cta-copy h2 {
    font-size: clamp(1.18rem, 5.1vw, 1.55rem);
  }

  .brand-copy small,
  .hide-mobile {
    display: none;
  }

  .brand-logo {
    width: 40px;
    height: 40px;
  }

  .feature-copy,
  .promise-cover,
  .promise-card,
  .cta-panel {
    padding: 24px;
  }
}
</style>
