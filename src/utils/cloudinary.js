import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
(async function() {

    // Configuration
    cloudinary.config({ 
    cloudinary_name: process.env.CLOUDINARY_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    

    const uploadImageToCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath) return null;
            // Upload the image
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: 'auto',
            });
            console.log("Image uploaded successfully", response.secure_url);
            return response;
        } catch (error) {
            console.log("Error uploading image", error);
            fs.unlinkSync(localFilePath);//remove the image from the local file system as the upload operation is failed
            return null;
        }
    };
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
})();