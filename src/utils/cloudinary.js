import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

console.log("Cloudinary configured successfully");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload function with better error handling
 const uploadImageToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("File path is required");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Remove local file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.log("File uploaded successfully",response)
    return response;
  } catch (error) {
    // Attempt to clean up local file on error
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (unlinkError) {
      console.error("Error deleting file:", unlinkError.message);
    }
    
    throw error;
  }

  //
};


//upload video to cloudinary
const uploadVideoToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("File path is required");
    }
  const response = await cloudinary.uploader.upload(localFilePath, {
    resource_type: "video",
  });
  } catch (error) {
    throw error;
  }
}
export { uploadImageToCloudinary, uploadVideoToCloudinary };