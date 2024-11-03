const express = require('express')
const router = express.Router()

const { users } = require('../models')
const passport = require('passport')

router.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/api/v1.0/users/signin/success',
    failureRedirect: '/api/v1.0/users/signin/fail',
  })
)

router.get('/signin/success', (req, res) => {
  res.status(200).json({})
})

router.get('/signin/fail', (req, res) => {
  res.status(204).json({})
})

router.get('/session-check', (req, res) => {
  res.status(200).json(req.user)
})

module.exports = router
