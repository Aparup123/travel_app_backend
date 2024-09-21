const express = require ('express')
const tripRouter=express.Router()
const Trip=require('../models/trip.model');
const isLoggedIn = require('./helper/isLoggedIn');
const User = require('../models/user.model');

tripRouter.get('/', async (req, res)=>{
    try{
        const trips=await Trip.find({});
        console.log('trips', trips)
        res.json(trips);
    }catch(err){
        console.log(err)
        res.status(400).json(err)
    }
})

tripRouter.get('/:id', async(req, res)=>{
    console.log("params:", req.params)
    try{
        const tripId = req.params.id
        const trip=await Trip.findById(tripId)
        res.json(trip)
    }catch(err){
        res.status(404).json("Not Found")
    }
})

tripRouter.post('/', async (req, res)=>{
    const tripObject=new Trip(req.body)
    try{
        const savedObject=await tripObject.save()
        res.json(savedObject)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

tripRouter.post('/many', async(req, res)=>{
    try{
        const tripsArray=req.body
        const savedTripsArray=await Trip.insertMany(tripsArray)
        res.json(savedTripsArray)
    }catch(err){
        console.log(err)
        res.status(400).json(err)
    }
})

tripRouter.post('/book/:id',isLoggedIn, async (req, res)=>{
    try{
        const tripId=req.params.id
        var trip=await Trip.findById(tripId)
        if(trip.booked_by.includes(req.userId)){
            return res.status(400).json("Trip already booked")
        }
        trip.booked_by.push(req.userId)
        trip.save()
        var user=await User.findById(req.userId)
        user.booked_trips.push(tripId)
        user.save()
        res.json(trip)
    }catch(err){
        console.log(err)
        res.status(400).json("Something went wrong")
    }

})



module.exports=tripRouter