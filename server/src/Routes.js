const User = require('./Models')
require('./Database')
const express = require('express')

const userRouter = new express.Router()


userRouter.post('/getwidgets', async (req, res) => {
    console.log('getwidgets called')
    try{
        const user = await User.findByCredentials('adam@example.com', 'sup1234')
        res.status(200).send({ user: user.getPublicProfile()})
    }
    catch(e){
        res.status(400).send('Incorrect credentials')
    }
})

userRouter.post('/updatewidgets', async (req, res) => {
    console.log('updatewidgets called')
    try{
        const user = await User.findByCredentials('adam@example.com', 'sup1234')
        req.body.widgets.foreach((em) => {
            user.widgets.foreach((e) => {
                if(em._id == e._id){
                    user.updateOne({value: em.value })
                }
            })
        })  
        res.status(200).send({ user: user.getPublicProfile()})
    }
    catch(e){
        res.status(400).send('Incorrect credentials')
    }
})











