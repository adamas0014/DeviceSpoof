
const express = require('express')
require('./Database')
const userRouter = require('./Routes')
const app = express()

let cors = require('cors')
app.use(cors({origin: "*"}))
const port = process.env.port || 4002

app.use(express.json())
app.use(userRouter)


app.listen(port, () => {
    console.log('server is up on port ' + port)
})







