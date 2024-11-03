const express = require('express')
const { loadNuxt, build } = require('nuxt')
const routes = require('./routes')

const app = express()

const http = require('http')
const server = http.createServer(app)

const config = require('../nuxt.config')
const isDev = process.env.NODE_ENV !== 'production'

const session = require('express-session')
const passport = require('./utils/passport')

app.use(
  session({
    secret: '1234',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
    },
  })
)
app.use(passport.initialize())
app.use(passport.session())

// JSON 요청 본문 파싱 미들웨어
app.use(express.json())
// URL-encoded 요청 본문 파싱 미들웨어
app.use(express.urlencoded({ extended: true }))

async function start() {
  // Nuxt 초기화
  const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

  // API 라우트 설정
  app.use('/api/v1.0', routes)

  // 모든 요청을 Nuxt로 전달
  app.use(nuxt.render)

  // Nuxt 빌드 (개발 모드에서만 사용)
  if (isDev) {
    await build(nuxt)
  }

  server.listen(3000, () => {
    console.log('Server On Port : 3000')
  })
}

start()
