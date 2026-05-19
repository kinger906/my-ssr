export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: [],
  css: [],
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || '',
    public: {
      appName: '数据管理系统'
    }
  },
  nitro: {
    experimental: {
      openAPI: true
    }
  }
})