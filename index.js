const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const { User } = require('./models/User');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());

//connect DB
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://yanghj:1234qwer@cluster0.e60n8x4.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.post('/register', (req, res) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    });
  });
});

app.listen(port, function(){ 
  console.log('node js start!');
});