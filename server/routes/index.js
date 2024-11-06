const express = require('express')
const router = express.Router()

const members = require('./members')
const records = require('./records')
const users = require('./users')

router.use('/members', members)
router.use('/records', records)
router.use('/users', users)

module.exports = router
