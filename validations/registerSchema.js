const userRegisterValidationSchema={
    username:{
        notEmpty:{
            errorMessage:'Username is empty'
        },
        isString:true,
        isLength:{
            options:{
                min:3,
                max:10
            },
            errorMessage:"Username should be between 3 to 10 characters long"
        }
    },
    email:{
        notEmpty:{
            errorMessage:'Email is empty'
        },
        isString:true,
        isEmail:true,
        errorMessage:'Not a valid email!'
    },
    name:{
        notEmpty:{
            errorMessage:'Name is empty'
        },
        isString:true,
        isLength:{
            options:{
                max:30,
            },
            errorMessage:'Name should be less than 30 character!'
        }
    },
    password:{
        notEmpty:{
            errorMessage:'Password is empty'
        },
        isString:{
            errorMessage:'Password should be a string'
        }
    },
    age:{
        notEmpty:{
            errorMessage:'Password is empty'
        },
        isNumeric:{
            errorMessage:'Age should be number'
        }
    }
}

module.exports={userRegisterValidationSchema}