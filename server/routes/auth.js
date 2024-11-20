const express = require('express')
const passport = require('passport')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares') // 내가 만든 사용자 미들웨어
const router = express.Router()

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.status(401).json({ message: 'Unauthorized' })

    req.logIn(user, (err) => {
      if (err) return next(err)
      console.log('Logged in user:', req.user) // req.user 확인

      req.session.user = user // 세션 데이터 추가
      req.session.save((err) => {
        if (err) return next(err)
        res.status(200).send('Login successful')
      })
    })
  })(req, res, next)
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
