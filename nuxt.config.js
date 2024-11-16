module.exports = {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Leave_Tracker',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/@fullcalendar/core/main.min.css',
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid/main.min.css',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  target: 'server', // SSR 방식으로 설정
  ssr: true, // 서버 사이드 렌더링 활성화
  buildModules: ['@nuxt/vercel-builder'], // Vercel 빌드 모듈 추가
  env: {
    // 필요한 환경 변수 설정 (선택 사항)
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    webpakc: { version: 4 },
    postcss: {
      plugins: {
        autoprefixer: {},
      },
    },
  },
}
