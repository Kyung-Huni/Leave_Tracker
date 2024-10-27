const express = require('express')
const router = express.Router()

const { records } = require('../models')
const { members } = require('../models')

router.post('/addInfo', async (req, res) => {
  const { reports } = req.body

  try {
    const recordPromisses = reports.map(async (report) => {
      const {
        departureDate,
        returnDate,
        rank,
        name,
        leaveType,
        duration,
        details,
      } = report

      const member = await members.findOne({
        where: {
          name: name, // 검색할 이름
        },
      })

      if (!member) {
        // 사용자가 존재하지 않을 경우
        throw new Error(`User ${name} Not Found`)
      }

      const id = member.id

      await records.create({
        departureDate: departureDate,
        returnDate: returnDate,
        leaveType: leaveType,
        duration: duration,
        memberId: id,
      })
    })

    await Promise.all(recordPromisses)
    res.status(201).json({ message: 'Successfully Added' })
  } catch (error) {
    console.error('Error submitting reports:', error)
    res.status(500).json({ message: 'Adding Failed', error: error.message })
  }
})

module.exports = router
