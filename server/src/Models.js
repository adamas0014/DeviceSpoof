const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema( {
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain the string: password')
            }
        }
    },
    tokens: [{
        type: String,
        required: true
    }],
    deviceTokens: [{
        type: String,
    }],
    profilePicture: {
         type: Buffer
    },
     widgets: [{
             title: {
                 type: String
             },
             img: {
                 type: String
             },
             location: {
                 type: String
             },
             reading: {
                 type: String
             },
             units: {
                 type: String
             },
             description: {
                type: String
             }

         }]
     
})



userSchema.methods.generateAuthToken = function() {
    console.log("inside generateAuthToken")
    
    const token = jwt.sign({_id: this._id.toString()}, 'McMaster', {expiresIn: "7 days"})
    console.log("token = " + token)
    this.tokens = this.tokens.concat(token)
    console.log("tokens concatenated")
    this.save()
    console.log("token saved") 
    return token

}


userSchema.methods.getPublicProfile = function () {
    const user = this
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.deviceTokens

    return userObject
}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email: email})
    console.log("user = " + JSON.stringify(user))
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    console.log("isMatch = " + isMatch)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    console.log("returning")
    return user

}




//Hash password before saving
userSchema.pre('save', async function(next) {
    console.log('inside pre')
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    console.log("calling next")
    next()
})

const User = mongoose.model('User', userSchema)


module.exports = User




