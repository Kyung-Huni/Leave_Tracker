const express = require('express')
const router = express.Router()

const { members, records, users } = require('../models')

router.get('/', (req, res) => {
  console.log('admin API Page')
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
