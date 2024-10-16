const express = require ('express')
const tripRouter=express.Router()
const Trip=require('../models/trip.model');
const isLoggedIn = require('../middleware/helper/isLoggedIn');
const User = require('../models/user.model');
const isSellerOrAdmin = require('../middleware/isSellerOrAdmin');
const { checkSchema } = require('express-validator');
const tripValidationSchema =require('../validations/tripSchema');
const availableTickets = require('../utils/availableTickets');
const uploadTripImage  = require('../middleware/multer');
const path=require('path')
const uploadToCloudinary=require('../utils/cloudinary')

tripRouter.get('/', async (req, res)=>{
    try{
        const trips=await Trip.find({}).populate('booked_by').populate("seller");
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
        const trip=await Trip.findById(tripId).populate('booked_by').populate("seller") 
        res.json(trip)
    }catch(err){
        res.status(404).json("Not Found")
    }
})

tripRouter.post('/', isLoggedIn, isSellerOrAdmin, checkSchema(tripValidationSchema), async (req, res)=>{
    const tripObject=new Trip({...req.body, seller:req.userId})
    try{
        const savedTrip=await tripObject.save()
        const user=await User.findById(req.userId)
        user.created_trips.push(savedTrip._id)
        await user.save()
        res.json(savedTrip)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

tripRouter.put('/:id', isLoggedIn, isSellerOrAdmin, async(req, res)=>{
    let newTrip=req.body
    if(req.userId!=newTrip.seller._id) return res.status(401).json("You are not creator of this trip")
    
    try{
        const trip=await Trip.findById(newTrip._id)
        if(!trip) return res.status(404).json("Trip not found")
        
        if(trip._id) delete newTrip._id
        const tripUpdateObject=newTrip
        const updatedTrip=await Trip.findByIdAndUpdate(trip._id, tripUpdateObject, {new:true})
        console.log(updatedTrip)
        res.json(updatedTrip)
    }catch(err){
        console.log(err)
        return res.status(505).json("Unable to update")
    }
    
})

tripRouter.delete('/:id', isLoggedIn, isSellerOrAdmin,  async(req, res)=>{
    const tripId=req.params.id
    
    try{
        const trip=await Trip.findById(tripId)

        if(!trip) return res.status(404).json("Trip not found")

        if(req.userId!=trip.seller) return res.status(401).json("You cant delete the trip")

        const bookedByUsers=trip.booked_by
        if(bookedByUsers.length>0){
            bookedByUsers.forEach( async(userId)=>{
                const user=await User.findById(userId)
                if(user) {
                    user.booked_trips=user.booked_trips.filter((trip_id)=>trip_id!=tripId)
                    await user.save()
                }
            })
        }
        const deletedTrip=await Trip.findByIdAndDelete(tripId)
        res.json({
            msg:"successfully deleted",
            trip:deletedTrip
        })      
    }catch(err){
        return res.status(505).json("Couldn't delete")
    }
})

tripRouter.post('/image', uploadTripImage.single('file'), async(req, res)=>{
    console.log(req.file)
    try{
        if(req.file) {
            const uploadResult=await uploadToCloudinary(req.file.path)
            res.json(uploadResult)
        }
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
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
        if(availableTickets(trip)==0){
            return res.status(400).json("No tickets available")
        }
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