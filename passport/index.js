const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); //8. 세션쿠기와 아이디만 메모리에 저장한다. 다시 auth.js로 가서 에러있는지 확인 
  });
  // 위 두 과정은 메모리의 효율을 위해 실행되는 코드다.
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [{
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followers',
      }, {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followings',
      }],
    })
      .then(user => done(null, user)) // req.user , req.isAuthenticated()
      .catch(err => done(err));
  });

  local();
  kakao();
};
