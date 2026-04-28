<template>
  <div class="theme-intro-page">
    <section class="intro-panel">
      <div class="section-badge">Competition Themes</div>
      <h1>{{ introTitle }}</h1>
      <p v-if="tagline" class="tagline">{{ tagline }}</p>

      <div class="intro-copy">
        <p v-for="paragraph in introParagraphs" :key="paragraph">{{ paragraph }}</p>
      </div>
    </section>

    <section class="maps-panel">
      <div class="maps-head">
        <div class="section-badge">Theme Maps</div>
        <h2>赛事地图</h2>
        <p>本赛季的赛事地图集中展示在这里，帮助学生和机构先了解探索主题，再进入具体任务。</p>
      </div>

      <div class="map-grid">
        <article v-for="theme in themeMaps" :key="theme.id" class="map-card">
          <div class="map-copy">
            <div class="map-title-row">
              <div>
                <h3>{{ theme.name }}</h3>
                <span class="map-age">{{ theme.ageRange }}</span>
              </div>
            </div>
            <p>{{ theme.desc }}</p>
          </div>

          <div class="map-frame">
            <img :src="theme.mapImage" :alt="`${theme.name}赛事地图`" />
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { themes } from '@/mock/themes.js'

const FALLBACK_TEXT = `“星际源力”赛事介绍
本赛季，我们以“星际源力”为核心命题，引领少年探索者奔赴月球与火星的广袤疆域，解锁宇宙深处的未知奥秘，唤醒心中潜藏的星际探索热忱。
星辰大海，是人类刻在基因里的向往。月球环形山间，藏着天体演化的神秘密码；火星赤色沙丘上，萦绕着外星生命与宜居家园的无限遐想，这里早已成为人类深空梦想的重要坐标。你对星际有怎样的憧憬？是渴望踏上月球，在温差悬殊的月壤上留下专属印记？还是想穿梭火星峡谷，探寻这颗红色星球的未知奥秘？
月火的静谧与苍茫，正等待少年们以科技破局、以创新赋能，如何搭建稳定的地星通信链路？如何高效利用原位资源实现星际生存？如何构筑可持续发展的星际基地？这些命题，等待你用智慧与技术给出答案。
本次赛事中，学生们将以团队协作之名，凭动手实践之力，沉浸式模拟星际探测全场景。在探索中发现问题，在研讨中优化创意，在实操中落地解决方案。我们期待每一位少年，以科技与工程为桥，联通星际奥秘；以少年智慧为引擎，激活深藏的“星际源力”，让月球与火星，成为人类拓展宇宙的前哨站、承载少年梦想的新家园。
用科技赴星海之约，用创意点亮苍穹，星际未来，由你们亲手驱动！

核心宣传短句（适配网页banner/导航栏）：星际源力，点亮未来!`

const introTitle = ref('赛事主题介绍')
const introParagraphs = ref([])
const tagline = ref('')

const mapAssetByTheme = {
  moon: '/themes/moon-map.jpg',
  mars: '/themes/mars-map.png',
}

const themeMaps = computed(() =>
  themes
    .filter((theme) => mapAssetByTheme[theme.id])
    .map((theme) => ({
      ...theme,
      mapImage: mapAssetByTheme[theme.id],
    })),
)

function applyIntroText(rawText) {
  const lines = rawText
    .replace(/\uFEFF/g, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (!lines.length) return

  const sloganLine = lines.find((line) => line.startsWith('核心宣传短句'))
  introTitle.value = lines[0] || '赛事主题介绍'
  introParagraphs.value = lines.slice(1).filter((line) => line !== sloganLine)
  tagline.value = sloganLine ? sloganLine.split(/[:：]/).slice(1).join('：').trim() : ''
}

async function loadIntroText() {
  try {
    const filePath = encodeURI(`${import.meta.env.BASE_URL}新建 文本文档.txt`)
    const response = await fetch(filePath)
    if (!response.ok) throw new Error('load failed')
    applyIntroText(await response.text())
  } catch {
    applyIntroText(FALLBACK_TEXT)
  }
}

onMounted(loadIntroText)
</script>

<style scoped>
.theme-intro-page {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: calc(var(--header-h) + 48px) 0 56px;
  display: grid;
  gap: 28px;
}

.intro-panel,
.maps-panel {
  padding: 28px;
  border: 1px solid var(--border);
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(255,255,255,0.8), transparent 42%),
    rgba(255,255,255,0.88);
  box-shadow: var(--shadow-sm);
}

.section-badge {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(0,0,0,0.05);
  color: var(--text-light);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.intro-panel h1,
.maps-head h2 {
  margin: 16px 0 0;
  font-size: var(--page-title-size);
  line-height: 1.04;
  letter-spacing: -0.04em;
}

.tagline {
  margin: 14px 0 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
}

.intro-copy {
  margin-top: 22px;
  display: grid;
  gap: 14px;
}

.intro-copy p,
.maps-head p,
.map-copy p {
  margin: 0;
  color: var(--text-light);
  line-height: 1.75;
  font-size: 15px;
}

.map-grid {
  margin-top: 24px;
  display: grid;
  gap: 18px;
}

.map-card {
  display: grid;
  grid-template-columns: minmax(0, 280px) minmax(0, 1fr);
  gap: 18px;
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: 24px;
  background: rgba(247,244,239,0.72);
}

.map-copy {
  display: grid;
  align-content: start;
  gap: 12px;
}

.map-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.map-title-row h3 {
  margin: 0;
  font-size: 22px;
  line-height: 1.1;
}

.map-age {
  display: inline-block;
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 12px;
}

.map-frame {
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.08);
  background: #fff;
}

.map-frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 900px) {
  .theme-intro-page {
    width: min(100% - 24px, 1120px);
    padding-top: calc(var(--header-h) + 38px);
  }

  .intro-panel,
  .maps-panel {
    padding: 22px;
    border-radius: 24px;
  }

  .map-card {
    grid-template-columns: 1fr;
  }
}
</style>
