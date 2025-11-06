export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@element-plus/nuxt'
  ],

  devtools: { enabled: true },

  css: [
    '~/assets/css/main.css',
    'element-plus/dist/index.css'
  ],

  app: {
    head: {
      title: '深圳MOTOTEC项目管理系统',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'MOTOTEC项目资料管理系统' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      supabaseUrl: 'https://ytgkpukabphhknghagso.supabase.co',
      supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0Z2twdWthYnBoaGtuZ2hhZ3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzODIzMzIsImV4cCI6MjA3Nzk1ODMzMn0.8-WGA4ahpMWTfpsk12IfkK2ew0STBplkhYTigl7kcPU'
    }
  },

  elementPlus: {
    importStyle: 'css'
  },

  compatibilityDate: '2024-11-06'
})
