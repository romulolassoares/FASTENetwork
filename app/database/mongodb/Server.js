require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/fastenetwork", {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on('error', (err)=>{
    console.log(err)
})

db.once('open', ()=>{
    console.log('Database connected!')
})

app.use(express.json())


module.exports = mongoose