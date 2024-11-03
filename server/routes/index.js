const express = require('express')
const router = express.Router()

const admin = require('./admin')
const records = require('./records')
const users = require('./users')

router.use('/admin', admin)
router.use('/records', records)
router.use('/users', users)

module.exports = router
