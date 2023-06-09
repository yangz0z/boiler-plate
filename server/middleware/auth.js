const { User } = require('../models/User')

//인증처리
let auth = (req, res, next) => {
    //클라이언트 쿠키에서 토큰을 가져옴(cookie-parser)
    let token = req.cookies.x_auth
    
    //토큰을 복호화한 후 유저를 찾음(User)
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({isAuth: false, error: true})

        req.token = token
        req.user = user
        next()
    })
}

module.exports = { auth };