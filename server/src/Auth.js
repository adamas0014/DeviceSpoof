
const jwt = require('jsonwebtoken')
const User = require('./Models')


const auth = async (req, res, next) => {
    try{
        //console.log(JSON.stringify(req.header.Authorization))
        //console.log("inside trt: req = " + JSON.stringify(req.data.widget))
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token)
        console.log("token = " + token)
        const decoded = jwt.verify(token, 'McMaster')
        console.log("decoded = " + JSON.stringify(decoded))
        const user = await User.findOne({ _id: decoded._id})
        console.log("User found = " + JSON.stringify(user))
        if(!user){
            throw new Error()
        }

        req.user = user

        next()

    }catch(e){
        res.status(401).send({error: 'Please authenticate.'})
    }
}









module.exports = {auth}