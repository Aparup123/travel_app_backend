const tripValidationSchema={
    title: {
        notEmpty:true,
        isString:true,
    },
    description:{
        notEmpty:String,
        isString:true
    },
    duration:{
        notEmpty:true,
        isString:true,
    },
    location:String,
    total_capacity: {
        isDecimal:true,
    },
    total_booked:{isInt:true,},
    available_tickets:{isInt:true,},
    price:{isDecimal:true,}
}

module.exports=tripValidationSchema