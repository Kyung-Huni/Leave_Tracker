const express = require('express')
const router = express.Router()

const admin = require('./admin')
const records = require('./records')

router.use('/admin', admin)
router.use('/records', records)

module.exports = router
