const multer = require("multer")
const path=require('path')
const tripStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/trip_images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname))
    }
  })

  const uploadTripImage = multer({ storage: tripStorage })

  
  const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/user_profile_images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname))
    }
  })

  const uploadUserImage=multer({storage:userStorage})
  module.exports= {uploadTripImage, uploadUserImage} 
