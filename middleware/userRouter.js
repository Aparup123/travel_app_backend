const express=require('express')
const userRouter=express.Router()
const User=require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt=require('bcrypt')
const isLoggedIn=require('../middleware/helper/isLoggedIn')
const {body, validationResult, checkSchema} = require('express-validator')
const { userRegisterValidationSchema } = require('../validations/registerSchema')
const {userLoginValidationSchema} = require('../validations/loginSchema')
const Trip = require('../models/trip.model')
userRouter.get('/',isLoggedIn, async (req, res)=>{
    const users=await User.find({})
    res.json(users)
})



userRouter.post('/register',checkSchema(userRegisterValidationSchema), async(req, res)=>{
    const result=validationResult(req)
    console.log(result)
    if(result.errors.length>0){
        return res.status(403).json(result.errors)
    }
    try{
        let data=req.body;
        console.log('userdata:',data)
        const passwordHash=await bcrypt.hash(data.password, 10)
        console.log(passwordHash)

        data={...data, password:passwordHash}

        const user=new User(data)
        console.log(data)
        const savedUser=await user.save();
        console.log("Saved:", savedUser)
        
        userDataForToken={userId:savedUser._id, username:savedUser.username }
        const token=jwt.sign(userDataForToken, process.env.SECRET)
        console.log(token)
        // const {email, name, username, booked_trips}=savedUser
        // const savedUserData={email, name, username, booked_trips}
        const userData=savedUser.toObject()
        delete userData.password
        res.cookie('token', token)
        res.json(userData)
    }catch(err){
        console.log(err)
        res.status(400).json({error:"Failed to register"})
    } 
})

userRouter.get('/profile/',isLoggedIn, async(req, res)=>{
    console.log('inside profile')
    try{
        const userData=await User.findById(req.userId).populate('booked_trips')
        if(!userData) return res.status(401).json({
            error:'unauthorized',
            route:'/login'
        })
        // convert the userData mongoose object to plain object
        const user=userData.toObject()
        delete user.password
        console.log(user)
        res.json(user)
    }catch(err){
        console.log(err)
        res.status(401).json({
            error:'unauthorized',
            route:'/login'
        })
    }
})

userRouter.post('/login',checkSchema(userLoginValidationSchema),async(req, res)=>{
    // Validating the request
    const result=validationResult(req)
    if(result.errors.length>0){
        console.log(result.errors)
        return res.status(400).json(result.errors)
    }

    const {email, password}=req.body
    const user=await User.findOne({email:email}).populate('booked_trips')

    if(user){
        const passwordCorrect=await bcrypt.compare(password, user.password)
        if(passwordCorrect){
            const userData={
                userId:user.id,
                username:user.username
            }   
            const token=jwt.sign(userData, process.env.SECRET)
            res.cookie('token', token)
            const userDataForProfile=user.toObject()
            delete userDataForProfile.password
            res.json(userDataForProfile)
        }else{
            console.log('password incorrect')
            res.status(401).json(
                {
                    error:"Auth error",
                    route:'/login'
                }
            )
        }
    }else{
        console.log('no user found')
        res.status(401).json(
                {
                    error:"Auth error",
                    route:'/login'
                }
            )
    }

})

userRouter.post('/logout', async (req, res)=>{
    res.cookie('token', '', { sameSite: 'None', secure: true })
    res.json('logged out')
})

//Cancel trip booking
userRouter.delete('/trips/:id', isLoggedIn, async (req, res)=>{
    // Saving user_id and trip_id
    const userId=req.userId
    const tripId=req.params.id
    try{

        // Remove the trip_id from user's booked_trips
        const user = await User.findById(userId)
        // The user can't cancel an unbooked trip
        if(!user.booked_trips.includes(tripId))
            res.status(400).json("Trip is not booked")
        user.booked_trips = user.booked_trips.filter((id) => id != tripId)
        user.save()
        // Remove the user_id from trip's booked_by
        const trip=await Trip.findById(tripId)
        // The user can't cancel an unbooked trip
        if(!trip.booked_by.includes(userId))
            res.status(400).json("Trip is not booked")
        trip.booked_by=trip.booked_by.filter((id)=>id!=userId)
        trip.save()
        res.json(trip)
    }catch(err){
        console.log(err)
        res.status(400).json(err)
    }
})
module.exports=userRouter