const express = require('express')
const { loadNuxt, build } = require('nuxt')
const routes = require('./routes')
const passportConfig = require('./utils/passport')
const cors = require('cors')

const app = express()

const http = require('http')
const server = http.createServer(app)

const config = require('../nuxt.config')
const isDev = process.env.NODE_ENV !== 'production'

const session = require('express-session')
const passport = require('passport')

const corsOptions = {
  origin: 'https://leave-tracker-livid.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions))

passportConfig() // 패스포트 설정

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
    },
  })
)

// passport-local 미들웨어 등록
app.use(passport.initialize())
app.use(passport.session())

// JSON 요청 본문 파싱 미들웨어
app.use(express.json())
// URL-encoded 요청 본문 파싱 미들웨어
app.use(express.urlencoded({ extended: true }))

async function start() {
  // Nuxt 초기화
  const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

  // Nuxt 빌드 (개발 모드에서만 사용)
  if (isDev) {
    await build(nuxt)
  }

  // API 라우트 설정
  app.use('/api', routes)

  server.listen(3000, () => {
    console.log('Server On Port : 3000')
  })
}

start()
