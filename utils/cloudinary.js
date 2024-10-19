const v2 = require('cloudinary');
const cloudinary=v2
 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
});

async function uploadToCloudinary(filePath) {

   
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

async function deleteFromCloudinary(pid){
    const deleteResult=await cloudinary.uploader.destroy(pid, {resource_type:'image', invalidate:true})
    return deleteResult
}
module.exports={uploadToCloudinary, deleteFromCloudinary}