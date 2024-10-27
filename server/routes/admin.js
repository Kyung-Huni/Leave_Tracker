const express = require('express')
const router = express.Router()

const { members, records, users } = require('../models')

router.get('/', (req, res) => {
  console.log('admin API Page')
})

module.exports = router
