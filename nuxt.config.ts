export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: [],
  css: [],
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || '',
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN || '',
    public: {
      appName: '数据管理系统'
    }
  },
  nitro: {
    preset: 'vercel',
    experimental: {
      openAPI: true
    }
  }
})