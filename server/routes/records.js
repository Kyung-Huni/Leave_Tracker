const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')

const { records } = require('../models')
const { members } = require('../models')
const { outings } = require('../models')

const unitColors = {
  '501 본부중대': '#6FA3EF', // 파란색
  '3정보 본부중대': '#90C290', // 올리브 그린
  '3정보 A/B': '#FFC082', // 연주황색
  '3정보 찰리': '#B89FCF', // 보라색
  '524정보대대': '#F7B2AD', // 코랄 핑크
}

router.get('/', async (req, res) => {
  const { start, end } = req.query
  console.log('Received query params:', { start, end }) // 추가된 부분

  try {
    const filteredRecords = await records.findAll({
      where: {
        [Op.or]: [
          {
            departureDate: {
              [Op.between]: [start, end],
            },
          },
          {
            returnDate: {
              [Op.between]: [start, end],
            },
          },
        ],
      },
      include: [
        {
          model: members,
          attributes: ['rank', 'name', 'unit'],
        },
      ],
    })

    res.status(200).json(filteredRecords)
  } catch (error) {
    console.error('Error fetching records: ', error)
    res
      .status(500)
      .json({ message: 'Failed to retrieve records', error: error.message })
  }
})

router.get('/today', async (req, res) => {
  const { todayDate } = req.query

  const todayDateObj = new Date(todayDate)

  try {
    const onLeaveResult = await records.findAndCountAll({
      where: {
        [Op.and]: [
          {
            departureDate: {
              [Op.lte]: todayDateObj,
            },
          },
          {
            returnDate: {
              [Op.gt]: todayDateObj,
            },
          },
          {
            leaveType: '휴가',
          },
        ],
      },
    })

    const onPassResult = await records.findAndCountAll({
      where: {
        [Op.and]: [
          {
            departureDate: {
              [Op.gte]: todayDateObj,
            },
          },
          {
            returnDate: {
              [Op.lt]: todayDateObj,
            },
          },
          {
            leaveType: ['외박', '특이외박', '근무외박'],
          },
        ],
      },
    })

    const outingResult = await outings.findAndCountAll({})

    return res.json({
      onLeaveResult: onLeaveResult.count,
      onPassResult: onPassResult.count,
      outingResult: outingResult.rows,
      outingCount: outingResult.count,
    })
  } catch (error) {
    console.error('Error fetching records: ', error)
    res
      .status(500)
      .json({ message: 'Failed to retrieve records', error: error.message })
  }
})

router.post('/addInfo', async (req, res) => {
  const { reports, outingReports } = req.body

  try {
    if (outingReports) {
      const outingPromisses = outingReports.map(async (outing) => {
        const { nameRank, location, reason, time } = outing

        const existingOuting = await outings.findOne({
          where: {
            nameRank,
            location,
            time,
          },
        })

        if (existingOuting) {
          return null
        }

        await outings.create({
          nameRank: nameRank,
          location: location,
          reason: reason,
          time: time,
        })
      })

      await Promise.all(outingPromisses)
    }

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

      const color = unitColors[member.unit] || 'grey' // unitColors에 없는 경우 기본 색상은 grey로 설정

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
          color: color,
          memberId: member.id,
        })
      } else if (leaveType === '특이외박' || leaveType === '근무외박') {
        await records.create({
          departureDate: departureDate,
          returnDate: returnDate,
          leaveType: leaveType,
          comment: comments,
          color: color,
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
