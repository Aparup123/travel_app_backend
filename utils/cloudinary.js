const v2 = require('cloudinary');
const cloudinary=v2
async function uploadToCloudinary(filePath) {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY , 
        api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
        filePath, 
       )
       .catch((error) => {
           console.log(error);
       });
    
    return uploadResult;
    
     
};

module.exports=uploadToCloudinary