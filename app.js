require('dotenv').config()
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose');
const User=require('./models/user.model')
const express=require('express');
const app=express();
const cors=require('cors')
const tripRouter=require('./routes/tripRouter');
const userRouter = require('./routes/userRouter');
const cookieParser=require('cookie-parser');
const isLoggedIn = require('./middleware/helper/isLoggedIn');

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(express.json())

// app.use(express.static('assets/images'))

app.use(cookieParser())
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL_DEV);
        console.log("Database connected successfuly")
    }catch(err){
        console.log("Failed to connect DB\n", err)
    }
}
connectDB()

// app.use(express.static(__dirname+'/dist'))

app.use('/api/trips/',tripRouter)

app.use('/api/users/', userRouter)

app.get('/login', async(req, res)=>{
    try{
    const token=req.cookies.token 
    console.log(token)
    if(!token) return res.send('something went wrong')
    const tokenData=jwt.verify(token, process.env.SECRET)
    console.log(tokenData)
    const user=await User.findOne({username:tokenData.username})

    if(user) res.json('logged in');
    else res.send('something went wrong')
    }
    catch(err){
        console.log(err)
        res.json('something went wrong')

    }

})



module.exports=app