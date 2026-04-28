<template>
  <div class="page bump-page">
    <div class="container bump-shell">
      <section class="bump-copy">
        <div class="sbadge">Bump Exchange</div>
        <h1>碰一碰</h1>
        <p>和你的小伙伴们互相扫码学习吧！</p>
      </section>

      <section class="bump-main">
        <div class="qr-card card">
          <div class="qr-top">
            <div class="qr-info">
              <h3>{{ us.nickname }}</h3>
              <p>{{ us.teamName }}</p>
            </div>
          </div>

          <div class="qr-code-area">
            <div class="qr-code">
              <img class="qr-image" src="/宣传素材/bump.png" alt="碰一碰二维码" decoding="async" />
            </div>
            <p class="qr-hint">让队友扫描此二维码</p>
          </div>

          <div class="my-tasks">
            <div class="mono-label">我可分享的题组</div>
            <div class="mt-list">
              <span v-for="group in myUnlockedGroups" :key="group" class="mt-tag">题组 {{ group }}</span>
              <span v-if="!myUnlockedGroups.length" class="mt-empty">暂无可分享题组</span>
            </div>
          </div>
        </div>

        <router-link to="/bump/scan" class="btn btn-primary btn-lg scan-btn">扫描伙伴二维码</router-link>

        <div v-if="bumpHistory.length" class="bump-history card">
          <div class="mono-label">互动记录</div>
          <div v-for="(item, index) in bumpHistory" :key="index" class="bh-item">
            <span class="bh-icon">↔</span>
            <div class="bh-info">
              <span class="bh-name">{{ item.partnerName }}</span>
              <span class="bh-detail">你获得题组 {{ item.myGot }} · 对方获得题组 {{ item.theirGot }}</span>
            </div>
            <span class="bh-time">{{ item.time }}</span>
          </div>
        </div>

        <div class="bump-rules card">
          <div class="mono-label">规则说明</div>
          <ul>
            <li>每位学生默认拥有 1 个可分享题组。</li>
            <li>互扫成功后，双方各获得对方一个已解锁题组。</li>
            <li>已解锁的新题组可以继续分享给其他伙伴。</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.js'

const us = useUserStore()

const myUnlockedGroups = ref(JSON.parse(localStorage.getItem('pook_my_groups') || '["1"]'))
const bumpHistory = ref(JSON.parse(localStorage.getItem('pook_bump_history') || '[]'))
</script>

<style scoped>
.bump-page {
  animation: fadeSlideUp 0.32s ease;
}

.bump-shell {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.bump-copy h1 {
  font-size: var(--page-title-size);
  margin: 14px 0 12px;
}

.bump-copy p {
  color: var(--text-light);
  line-height: 1.8;
}

.qr-card,
.bump-history,
.bump-rules {
  margin-bottom: 14px;
}

.qr-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.qr-emoji {
  font-size: 2rem;
}

.qr-info h3 {
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.qr-info p,
.qr-hint,
.bh-detail,
.bh-time,
.mt-empty {
  color: var(--text-light);
}

.qr-code-area {
  text-align: center;
  margin-bottom: 18px;
}

.qr-code {
  width: 220px;
  height: 220px;
  margin: 0 auto 12px;
  padding: 10px;
  border-radius: 28px;
  background: rgba(0,0,0,0.03);
}

.qr-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.my-tasks {
  padding-top: 16px;
  border-top: 1px solid rgba(0,0,0,0.08);
}

.mt-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.mt-tag {
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(0,0,0,0.04);
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
}

.scan-btn {
  margin-bottom: 14px;
}

.bh-item {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid rgba(0,0,0,0.06);
}

.bh-item:first-of-type {
  margin-top: 12px;
}

.bh-name {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
}

.bh-icon {
  width: 32px;
  height: 32px;
  border-radius: 12px;
  background: rgba(0,0,0,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bump-rules ul {
  margin-top: 12px;
  padding-left: 18px;
  color: var(--text-light);
  line-height: 1.75;
}

@media (max-width: 980px) {
  .bump-shell {
    grid-template-columns: 1fr;
  }
}
</style>
