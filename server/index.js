const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const http = require('http')
const session = require('express-session')
const RedisStore = require('connect-redis').default
const redis = require('redis')
const passport = require('passport')
require('./passport').config(passport)
require('dotenv').config()

const app = express()
const server = http.createServer(app)

const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,

  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
})

client.on('error', (err) => console.error('Redis Error:', err))

// 연결
;(async () => {
  await client.connect()
})()

const corsOptions = {
  origin: 'https://leave-tracker-livid.vercel.app',
  methods: ['GET', 'POST'],
  credentials: true, // 쿠키 전송을 허용
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser(process.env.SECRET))
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({ client }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    },
    name: 'session-cookie',
  })
)

// passport-local 미들웨어 등록
app.use(passport.initialize())
app.use(passport.session())

async function start() {
  // API 라우트 설정
  app.use('/api', routes)

  server.listen(3000, () => {
    console.log('Server On Port : 3000')
  })
}

start()
