const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username:String,
    name: String,
    email:String,
    password:String,
    age:Number,
    role:{
        type:String,
        default:'user',
        enum:['admin', 'user', 'seller']
    },
    booked_trips:[{
        type:mongoose.Schema.ObjectId,
        ref:'Trip'
    }],
    created_trips:[{
        type:mongoose.Schema.ObjectId,
        ref:'Trip'
    }],
    org_name:String,
    org_location:String,
},{
    toJSON:{transform:function(doc, ret){
       
        delete ret.__v
    }}
})

const User=mongoose.model('User', userSchema)

module.exports=User;