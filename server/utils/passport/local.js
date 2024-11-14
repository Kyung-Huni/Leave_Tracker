const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')

const { users } = require('../../models')

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'uid',
        passwordField: 'password',
        passReqToCallback: false,
      },
      async (uid, password, done) => {
        try {
          const exUser = await users.findOne({ where: { uid } })

          if (exUser) {
            console.log('입력된 비밀번호:', password)
            console.log('저장된 비밀번호:', exUser.password)

            const result = exUser.password === password

            if (result) {
              done(null, exUser)
            } else {
              done(null, false, { message: '비밀번호가 일치하지 않습니다.' })
            }
          } else {
            console.log('fail!!')
            done(null, false, { message: '가입되지 않은 회원입니다.' })
          }
        } catch (error) {
          console.error(error)
          done(error)
        }
      }
    )
  )
}
