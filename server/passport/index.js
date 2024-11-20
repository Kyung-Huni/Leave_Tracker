const LocalStrategy = require('passport-local').Strategy
const { users } = require('../models')

exports.config = (passport) => {
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
        done(null, user.uid)
      })
      .catch((err) => done(err))
  })

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'uid',
        passwordField: 'password',
      },
      async (uid, password, done) => {
        try {
          const exUser = await users.findOne({ where: { uid: uid } })

          if (exUser) {
            const result = exUser.password == password
            console.log('User found:', exUser)
            console.log('Checking user:', uid)
            console.log('Login result: ', result)

            if (result) {
              done(null, {
                uid: exUser.uid,
                id: exUser.id,
                status: exUser.status,
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
