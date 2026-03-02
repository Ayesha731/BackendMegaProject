import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js"; // Import the function, not the default
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // -------Rules for registration flow-------
    //get user details from body or from frontend
    //validate the user details--if any field is empty, throw an error
    //check if user already exists--through email or username
    //check for images, check for avatar and coverImage
    //if they are provided, then upload them to cloudinary
    //if they are not provided, then set the value to empty string
    //create a new user Object-create entry in the database
    //remove sensitive fields from the user object like password, refreshToken, createdAt, updatedAt
    //check for user creation success or failure
    //return the user details or return response accordingly
    const { username, email, fullName, password } = req.body;
    console.log("req.body",req.body)
    // Check empty fields
    if (
        [
            username,
            email,
            fullName,
            password,
        ].some(field => field?.trim() === "" || field?.trim() === undefined || field?.trim() === null)
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists");
    }
    console.log("req.files",req.files)

    // Get file paths
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    //coverimage may be aur may not be provided
    //write the code for coverImage which is optional
    //if coverImage is provided, then upload it to cloudinary
    //if coverImage is not provided, then set coverImageUrl to empty string
    let coverImageLocalPath = "";
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }   

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }
    // if avatar found then upload avatar and cover image to Cloudinary
    let avatarUrl = await uploadImageToCloudinary(avatarLocalPath);
    let coverImageUrl = await uploadImageToCloudinary(coverImageLocalPath);
    if (!avatarUrl || !coverImageUrl) {
        throw new ApiError(500, "Something went wrong while uploading avatar and cover image");
    }

    // Create new user
    const newUser = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatarUrl.secure_url,
        coverImage: coverImageUrl?.secure_url || "",
    });

    if (!newUser) {
        throw new ApiError(500, "Something went wrong while creating user");
    }

    // Remove sensitive fields from the user data
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken -createdAt -updatedAt");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

export default registerUser;