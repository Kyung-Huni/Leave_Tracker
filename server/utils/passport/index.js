const passport = require('passport')
const local = require('./local')

const { users } = require('../../models')

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id) // 세션에 사용자 uid만 저장
  })

  passport.deserializeUser((id, done) => {
    // 세션에서 uid를 받아서 다시 데이터베이스에서 사용자 조회
    users
      .findOne({ where: { id } })
      .then((user) => done(null, user))
      .catch((err) => done(err))
  })

  local()
}
