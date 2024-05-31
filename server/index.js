import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const morgan=require('morgan')
const auth=require('./routes/auth')
const post=require('./routes/post')
const chat=require('./routes/chat')
require("dotenv").config();


const app=express()
const PORT=process.env.PORT|| 8000
//middleware
app.use(express.json({limit:"5mb"}))
app.use(cors())
//database

mongoose.connect(process.env.MONGO_URL,
    { useUnifiedTopology: true }
)
.then(()=>console.log("Dtatabase connected sucessfully"))
.catch(err=>console.log("error",err))

// app.post('/api/register',(req,res)=>{
//     console.log("registered end point",req.body)
// })
app.get('/',(req,res)=>{
    res.send("Hello")
})
app.use('/api',auth)
app.use('/api/posts',post)
app.use('/api/chats',chat)
app.listen(PORT,()=>{
    console.log(`server is listening at port ${PORT}`)
})
