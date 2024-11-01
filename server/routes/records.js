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
        comments,
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

      // 중복된 데이터가 있는지 검색
      const existingRecord = await records.findOne({
        where: {
          departureDate,
          returnDate,
          memberId: member.id,
        },
      })

      // 중복된 데이터가 있을 경우 추가하지 않음
      if (existingRecord) {
        return null
      }

      // 휴가, 외박에 따라 다른 데이터 삽입
      if (leaveType === '휴가') {
        await records.create({
          departureDate: departureDate,
          returnDate: returnDate,
          leaveType: leaveType,
          duration: duration,
          details: details,
          comment: comments,
          memberId: member.id,
        })
      } else if (leaveType === '특이외박' || leaveType === '근무외박') {
        await records.create({
          departureDate: departureDate,
          returnDate: returnDate,
          leaveType: leaveType,
          comment: comments,
          memberId: member.id,
        })
      }
    })

    await Promise.all(recordPromisses)
    res.status(201).json({ message: 'Successfully Added' })
  } catch (error) {
    console.error('Error submitting reports:', error)
    res.status(500).json({ message: 'Adding Failed', error: error.message })
  }
})

module.exports = router
