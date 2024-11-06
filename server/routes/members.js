const express = require('express')
const router = express.Router()

const { members, records, users } = require('../models')

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Hello ${req.user.uid}`)
  } else {
    res.redirect('/signin')
  }
  var page = req.query.page || 0
  var limit = 5

  members
    .findAndCountAll({
      raw: true,
      limit: limit,
      offset: page * limit,
    })
    .then((result) => {
      res.json({
        totalCount: result.count,
        member: result.rows,
        limit: limit,
        currentPage: page,
      })
    })
})

router.post('/registry', async (req, res) => {
  const { rank, name, unit } = req.body

  try {
    const [member, created] = await members.findOrCreate({
      where: { name: name, rank: rank, unit: unit },
      defaults: {
        rank: rank,
        name: name,
        unit: unit,
      },
    })

    if (created) {
      res.status(201).json({ message: 'Successfully Added', member })
    } else {
      res.status(200).json({ message: 'Member already exists', member })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Adding Failed', error: error.message })
  }
})

module.exports = router
