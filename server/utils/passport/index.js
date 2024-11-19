const passport = require('passport')
const local = require('./local')

const { users } = require('../../models')

module.exports = () => {
  passport.serializeUser((user, done) => {
    if (!user || !user.id) {
      // 사용자 정보가 없으면 세션에 저장하지 않음
      return done(new Error('User not found'), null)
    }
    console.log('Serialized user:', user) // user 객체 확인
    done(null, user.id) // 세션에 사용자 uid만 저장
  })

  passport.deserializeUser((id, done) => {
    console.log('Deserialize ID:', id) // 세션에서 가져온 사용자 ID 출력
    users
      .findOne({ where: { id } })
      .then((user) => {
        if (!user) {
          return done(new Error('User not found'), null)
        }
        done(null, user)
      })
      .catch((err) => done(err))
  })

  local()
}
