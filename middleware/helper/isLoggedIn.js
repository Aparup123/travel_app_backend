require('dotenv').config()
const jwt=require('jsonwebtoken')
const User = require('../../models/user.model')
const isLoggedIn=async (req, res, next)=>{
    try {

        if(!req.cookies.token){
            return res.status(401).json({error:'you are not looged in',
            route:'/login'
            })
        }
        const userData=jwt.verify(req.cookies.token, process.env.SECRET)
        if(userData.userId){
            const userDataFromDB=await User.findById(userData.userId)
            if(!userDataFromDB){
                return res.status(401).json(
                    {error:'you are not logged in',
                        route:'/login'
                    })
            }
        }
        else{
            return res.status(401).json(
                    {error:'you are not looged in',
                        route:'/login'
                    })
        }
        req.userId=userData.userId
        req.userRole=userData.role
        next()
    }catch(err){
        console.log(err)
        return res.status(401).json(
                    {error:'you are not looged in',
                        route:'/login'
                    })
    }
}

module.exports=isLoggedIn