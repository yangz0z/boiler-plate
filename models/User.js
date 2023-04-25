const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name : {
        type: String,
        maxLength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minLength: 5
    },
    lastname: {
        type: String,
        maxLength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp : {
        type: Number
    }
})

userSchema.pre('save', function(next){
    let user = this;
    //password 변경시에만 암호화 작업
    if(user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            });
        });
    } else {
        next()
    }
})

//암호화된 데이터 비교
userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

//웹토큰 생성
userSchema.methods.generateToken = function(cb) {
    let user = this;
    let token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save().then(() => {
        cb(null, user)
    }).catch((err) => {
        cb(err)
    })
}


const User = mongoose.model('User', userSchema)

module.exports = { User }