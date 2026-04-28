<template>
  <div class="page not-found">
    <section class="nf card">
      <div class="nf-code">404</div>
      <h1>页面不存在</h1>
      <p>当前地址没有对应内容，返回首页或任务台继续浏览。</p>
      <div class="nf-actions">
        <router-link to="/" class="btn btn-ghost">返回首页</router-link>
        <router-link to="/tasks" class="btn btn-primary">打开任务台</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.not-found {
  min-height: calc(100vh - var(--header-h));
  display: flex;
  align-items: center;
  justify-content: center;
}

.nf {
  width: min(100%, 560px);
  text-align: center;
}

.nf-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 86px;
  height: 40px;
  padding: 0 18px;
  border-radius: 999px;
  margin-bottom: 18px;
  background: rgba(0,0,0,0.06);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: var(--ls-mono);
  color: var(--text-light);
}

h1 {
  margin-bottom: 10px;
  font-size: var(--page-title-size);
}

p {
  max-width: 420px;
  margin: 0 auto 24px;
  color: var(--text-light);
  line-height: 1.7;
}

.nf-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
