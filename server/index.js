const express = require('express')
const { loadNuxt, build } = require('nuxt')
const routes = require('./routes')
const passportConfig = require('./utils/passport')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const http = require('http')
const session = require('express-session')
const RedisStore = require('connect-redis').default
const redis = require('redis')

const app = express()
const server = http.createServer(app)
const isDev = process.env.NODE_ENV !== 'production'

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD,
})

// 클라이언트 이벤트 등록
client.on('connect', () => {
  console.log('Redis connected successfully!')
})

client.on('error', (err) => {
  console.error('Redis connection error:', err)
})

// 클라이언트 연결
;(async () => {
  try {
    await client.connect() // Redis 연결 시도
  } catch (err) {
    console.error('Failed to connect to Redis:', err)
    process.exit(1) // 연결 실패 시 프로세스 종료
  }
})()

const passport = require('passport')
passportConfig() // 패스포트 설정

const corsOptions = {
  origin: 'https://leave-tracker-livid.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // 쿠키 전송을 허용
}
app.use(cors(corsOptions))

app.use(cookieParser(process.env.SECRET))

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ client }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    },
    name: 'session-cookie',
  })
)

app.use((req, res, next) => {
  console.log('세션 상태:', req.session)
  next()
})

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
