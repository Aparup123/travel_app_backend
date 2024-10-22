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
    origin:"https://travel-x-theta.vercel.app",
    credentials:true
}))
app.use(express.json())

// app.use(express.static('assets/images'))

app.use(cookieParser())
const connectDB=async()=>{
    try{
        await mongoose.connect("mongodb+srv://aparuproychowdhury:BbPAcvJd7FRbO6ma@cluster0.ywhootz.mongodb.net/travel-x");
        console.log("Database connected successfully")
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

app.get('/', (req, res)=>{
    res.send("This is a backend api.")
})

module.exports=app