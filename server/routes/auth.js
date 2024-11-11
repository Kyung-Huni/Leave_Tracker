const express = require('express')
const passport = require('passport')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares') // 내가 만든 사용자 미들웨어
const router = express.Router()

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError)
      return next(authError)
    }
    if (!user) {
      console.log('hi')
      return res.redirect(`/login?loginError=${info.message}`)
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError)
        return next(loginError)
      }
      return res.redirect('/')
    })
  })(req, res, next)
})

router.get('/session-check', (req, res) => {
  if (req.session && req.user) {
    res.json({
      isAuthenticated: true,
      user: req.session.user,
    })
  } else {
    res.json({ isAuthenticated: false })
  }
})

module.exports = router
