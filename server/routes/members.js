const express = require('express')
const router = express.Router()

const { members, records, users } = require('../models')

router.get('/', (req, res) => {
  members
    .findAndCountAll({
      raw: true,
    })
    .then((result) => {
      const unitCounts = result.rows.reduce((acc, member) => {
        const unit = member.unit
        acc[unit] = (acc[unit] || 0) + 1
        return acc
      }, {})

      res.json({
        totalCount: result.count,
        member: result.rows,
        unitCounts,
      })
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ error: '서버 오류' })
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
