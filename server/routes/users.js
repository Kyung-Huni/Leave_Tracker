const express = require('express')
const router = express.Router()
const passport = require('passport')

router.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/api/v1.0/users/signin/success',
    failureRedirect: '/api/v1.0/users/signin/fail',
  })
)

router.get('/signin/success', (req, res) => {
  res.redirect('/')
})

router.get('/signin/fail', (req, res) => {
  res.status(401).json({})
})

router.get('/session-check', (req, res) => {
  if (req.session && req.session.user) {
    res.json({
      isAuthenticated: true,
      user: req.session.user,
    })
  } else {
    res.json({ isAuthenticated: false })
  }
})

module.exports = router
