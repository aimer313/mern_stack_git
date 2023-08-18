const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
// const mongoose = require('mongoose')

const app = express()

// dotenv.config({path : './db.js'})

require('dotenv').config();
require('./database/db')

// const User = require('./models/userSchema')

app.use(express.json()) // express json ko samjh kena ok (by middleware)
// app.use..->MiddleWare : we link our router files to make route easy
app.use(require('./router/auth'))
const PORT = process.env.PORT

app.use(bodyParser.json())
app.use(cors())



// Middle Ware

const middleware = (req , res , next) => {
    console.log("Hello Middlle ware")
    next();
}
app.get('/' , (req , res) => {
    res.send(`Hello world from server from app.js`)

})
app.get('/about' , middleware , (req , res) => {
    res.send(`Hello About world from server`)
    

})
app.get('/contact' , (req , res) => {
    res.send(`Hello Contact world from server`)

})

app.listen(PORT , () => {
    console.log(`Server running at ${PORT}`)
})


