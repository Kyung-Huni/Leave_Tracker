const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')

const { users } = require('../../models')

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'uid',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (uid, password, done) => {
        try {
          const exUser = await users.findOne({ where: { uid: uid }, raw: true })

          if (exUser) {
            const result = exUser.password == password
            console.log('Login result: ', result)

            if (result) {
              done(null, {
                uid: result['uid'],
                id: result['id'],
                status: result['status'],
              })
            } else {
              done(null, false, { message: '비밀번호가 일치하지 않습니다.' })
            }
          } else {
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
