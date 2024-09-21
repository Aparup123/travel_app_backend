const userLoginValidationSchema={
    email:{
        isString:true,
        notEmpty:{
            errorMessage:'Email is empty'
        },
        isEmail:{
            errorMessage:'Not a valid email'
        }
    },
    password:{
        isString:true,
        notEmpty:{
            errorMessage:'Password is empty'
        },
    }
}

module.exports={userLoginValidationSchema}