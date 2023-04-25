const express = require('express')
const app = express()
const port = 4000;
const bodyParser = require('body-parser')
const { User } = require('./models/User')
const cors = require('cors')

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
//application/json
app.use(bodyParser.json())
//모든 도메인 허용
app.use(cors())

//connect DB 
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://yanghj:1234qwer@cluster0.e60n8x4.mongodb.net/?retryWrites=true&w=majority', {
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
    res.json({success: false, err})
  })
})

app.listen(port, function(){ 
  console.log(`node js start ${port}!`)
})