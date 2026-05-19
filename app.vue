<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">{{ appName }}</h1>
      <p class="app-subtitle">数据管理与维护系统</p>
    </header>
    <main class="app-main">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appName = config.public.appName
</script>

<style>
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --color-primary: #4f46e5;
  --color-primary-hover: #4338ca;
  --color-danger: #dc2626;
  --color-danger-hover: #b91c1c;
  --color-success: #16a34a;
  --color-warning: #f59e0b;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-border: #e2e8f0;
  --color-text: #1e293b;
  --color-text-secondary: #64748b;
  --color-text-muted: #94a3b8;
  --radius: 8px;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, var(--color-primary), #7c3aed);
  color: white;
  padding: 24px 32px;
  box-shadow: var(--shadow);
}

.app-title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.app-subtitle {
  font-size: 0.9rem;
  opacity: 0.85;
  margin-top: 4px;
}

.app-main {
  flex: 1;
  padding: 32px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .app-header {
    padding: 16px 20px;
  }
  .app-title {
    font-size: 1.25rem;
  }
  .app-main {
    padding: 16px;
  }
}
</style>