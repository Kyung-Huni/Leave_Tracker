const express = require('express')
const passport = require('passport')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares') // 내가 만든 사용자 미들웨어
const router = express.Router()

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/api/auth/login/success',
    failureRedirect: '/api/auth/login/fail',
  }),
  (req, res) => {
    console.log('로그인 후 세션:', req.session) // 세션 데이터 확인
    req.session.user = req.body.uid // 로그인 정보 세션에 저장
  }
)

router.get('/login/success', (req, res) => {
  console.log('Success route reached, session:', req.session)
  res.status(200).json({ success: true })
})

router.get('/login/fail', (req, res) => {
  res.status(204).json({})
})

//* 로그아웃 (isLoggedIn 상태일 경우)
router.get('/logout', isLoggedIn, (req, res) => {
  // req.user (사용자 정보가 안에 들어있다. 당연히 로그인되어있으니 로그아웃하려는 거니까)
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: '로그아웃 실패', error: err })
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: '세션 파괴 실패', error: err })
      }
      res.clearCookie('connect.sid') // 세션 쿠키 삭제
      res.redirect('/')
    })
  })
})

router.get('/session-check', (req, res) => {
  if (req.session.user) {
    res.json({
      isAuthenticated: true,
      user: req.session.user,
    })
  } else {
    res.json({ isAuthenticated: false })
  }
})

module.exports = router
