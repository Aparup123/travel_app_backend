const mongoose=require('mongoose');

const imageSchema=new mongoose.Schema({
    pid:String,
    url:String
})
const tripSchema=new mongoose.Schema({
    title: String,
    description: String,
    start_date: Date,
    end_date: Date,
    location: String,
    total_capacity: Number,
    price:Number,
    cover_image:imageSchema,
    seller:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    booked_by:[{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
})

const Trip=mongoose.model('Trip', tripSchema)

module.exports=Trip;