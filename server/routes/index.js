const express = require('express')
const router = express.Router()

const members = require('./members')
const records = require('./records')
const auth = require('./auth')

router.use('/members', members)
router.use('/records', records)
router.use('/auth', auth)

module.exports = router
