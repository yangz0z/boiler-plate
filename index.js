const express = require('express')
const app = express()
const port = 4000;
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { User } = require('./models/User')
const cors = require('cors')
const config = require('./config/key')

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
//application/json
app.use(bodyParser.json())

app.use(cors())
app.use(cookieParser())

//connect DB 
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', function (req, res) {
  res.send('Hello World')
});

app.post('/register', async (req, res) => {
  const user = new User(req.body)
  const result = await user.save().then(() => {
    res.status(200).json({
      success: true
    })
  }).catch((err) => {
    res.json({ success: false, err })
  })
})

app.post('/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 찾기
  User.findOne({ email: req.body.email })
    .then(docs => {
      if (!docs) {
        return res.json({
          loginSuccess: false,
          message: "등록된 이메일이 아닙니다."
        })
      }
      //비밀번호 일치여부 확인(User.js)
      docs.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) return res.json({
          loginSuccess: false,
          message: "비밀번호가 일치하지 않습니다."
        })
        //일치한다면 user token 생성
        docs.generateToken((err, user) => {
          if (err) return res.status(400).send(err)
          //토큰을 쿠키에 저장
          res.cookie('x_auth', user.token).status(200)
          .json({
            loginSuccess: true,
            userId: user._id
          })
        })
      })
    })
})

app.listen(port, function () {
  console.log(`node js start ${port}!`)
})