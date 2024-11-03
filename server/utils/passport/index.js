const passport = require("passport");
const local = require("./local");
const { users } = require("../../models");

passport.serializeUser(function (user, done) {
  done(null, user.uid); // 세션에 사용자 uid만 저장
});

passport.deserializeUser(function (uid, done) {
  // 세션에서 uid를 받아서 다시 데이터베이스에서 사용자 조회
  users
    .findOne({ where: { uid: uid } })
    .then((user) => {
      if (!user) {
        return done(new Error("User not found"));
      }
      done(null, user); // 조회된 사용자 객체를 req.user에 전달
    })
    .catch((err) => done(err));
});

passport.use(local);

module.exports = passport;
