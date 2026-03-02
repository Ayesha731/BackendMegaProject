import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js"; // Import the function, not the default
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";



//generate access and refresh token
const generateAceessAndRefreshToken = async (userId) => {
    try {
       const user = await User.findById(userId);
       if (!user) {
        throw new ApiError(401, "User not found");
       }
       const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        //add refresh token to the user object in the database
        user.refreshToken = refreshToken;
        user.save({validateBeforeSave: false});//mean validate mt karo direct save krdo kyuki refresh token ek new field hai jo user mein add hoga aur yeh validation error dega kyuki user mein yeh field nahi hai.
       return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token");
    }
}

//registerUser
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


//loginUser
const loginUser = asyncHandler(async (req, res) => {
    // -------Rules for login flow-------
    //get user details from request body ---email and password----user body->data
    //find the user
    //password check-is it correct or not
    //generate access token and refresh token
    //send cookies

    const { email, password,username } = req.body;
    console.log("req.body",req.body)
    // Check empty fields
   if(!email && !username) {
    throw new ApiError(400, "Email or username is required");
   }

    // Check if user exists
    const user = await User.findOne({ $or: [{ email }, { username }] });// $or --> opertaor of mongoose to find the user by email or username
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Check if password is correct --using bcrypt compare method which is made in user model
    //password is coming from the user body and user.password is coming from the database---    User k sath hum mongoose k quries lagaty hn aur baqion cheezion k liye hum user use krty hn naky User ko hum database k sath compare krty hn naky user ko hum body k sath compare krty hn.
    // user.isPasswordCorrect(password) --> this is a method of user model which is used to compare the password
    //user--->comes from our body
    //User--->comes form database
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid user credentials"); 
    }

    //get access token and refresh token
    const { accessToken, refreshToken } = await generateAceessAndRefreshToken(user._id);
    

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -createdAt -updatedAt");//select is used to select the fields that we want to return to the user
    if (!loggedInUser) {
        throw new ApiError(401, "User not found");
    }
    
    const options = {
        httpOnly: true,
        secure:true,//means only send the cookie to the server if the request is coming from the same domain
        
    };
    
//set access token and refresh token in the cookies
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                    user: loggedInUser,
                    accessToken: accessToken,//user khood apni trf sa access token set krna chahta ha
                    refreshToken: refreshToken,//user khood apni trf sa refresh token set krna chahta ha
                }, "User logged in successfully")
            )

});

//logoutUser
const logoutUser = asyncHandler(async (req, res) => {
    // -------Rules for logout flow-------
    //get the refresh token from the cookies
    //find the user
    //remove the refresh token from the user object in the database
    //send the response

    await User.findByIdAndUpdate(req.user._id, //find the user by id and update the refresh token
        {
            $set:
                { refreshToken: undefined }//undefined means remove the refresh token from the user object in the database
        },
        {
            new: true    
        });//new: true means return the updated user
    
    const options = {
        httpOnly: true,
        secure:true,
        
    };
    
    return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(
        new ApiResponse(200, null, "User logged out successfully")
    );
});

//RefreshAccessToken
const refreshAccessToken = asyncHandler(async (req, res) => {
    // -------Rules for refresh access token flow-------
    //get the refresh token from the cookies
    //verify the refresh token
    //generate a new access token
    //send the access token in the response
    
    
    const incomingRefreshToken = req.cookies?.refreshToken  ||req.body.refreshToken;//we get this from the cookies because we use cookie parser middleware in app.js file
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

try {
     const decodedToken = jwt.verify(incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET);
        if (!decodedToken) {
            throw new ApiError(401, "Unauthorized request");
        }
    
        const user = await User.findById(decodedToken._id);
        if (!user) {
            throw new ApiError(401, "Unauthorized request");
        }
    
        if(user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Refresh token is not valid");
        }
    
        const options = {
            httpOnly: true,
            secure:true,
            
        };
        const { accessToken, newRefreshToken } = await generateAceessAndRefreshToken(user._id);
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: user,
                        accessToken: accessToken,
                        refreshToken: newRefreshToken
                    }, "Access token refreshed successfully")
            );
} catch (error) {

    throw new ApiError(500, error?.message || "Something went wrong while refreshing access token");
    }
   
});


//change current user password
const changeCurrentUserPassword = asyncHandler(async (req, res) => {
    // -------Rules for change current user password flow-------
    //get the old password from the request body
    //get the new password from the request body
    //find the user
    //check if the old password is correct
    //change the password
    //send the response

    const { oldPassword, newPassword, confirmPassword } = req.body;
  
    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "New password and confirm password do not match");
    }
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old password and new password are required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(401, "User not found");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid old password");
    }
    user.password = newPassword;
    await user.save({validateBeforeSave: false});
    return res
    .status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    );
});

//get current user
const getCurrentUser = asyncHandler(async (req, res) => {
    // -------Rules for get current user flow-------
    //get the user from the request object

    const user = req.user;
    if (!user) {
        throw new ApiError(401, "User not found");
    }
    return res.status(200).json(
        new ApiResponse(200, user, "User fetched successfully")
    );
});



//update current user
const updateCurrentUser = asyncHandler(async (req, res) => {
    // -------Rules for update current user flow-------
    //get the user from the request object
    //get the user details from the request body
    //update the user
    //send the response
    const { username, email, fullName } = req.body;
    if (!username || !email || !fullName) {
        throw new ApiError(400, "All fields are required");
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
       $set: {
          username: username.toLowerCase(),
          email,
          fullName,
         
        }
    },
        { new: true }
    ).select("-password -refreshToken -createdAt -updatedAt");
    
    return res
        .status(200)
        .json(
        new ApiResponse(200, user, "User Account details updated successfully")
    );
});


//update user avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
    // -------Rules for update user avatar flow-------
    //get the user from the request object
    //get the avatar from the request body
    //update the avatar
    //send the response


    
    console.log("req.file",req.file)
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }
    //upload the avatar to cloudinary
    const avatarUrl = await uploadImageToCloudinary(avatarLocalPath);
    
    if (!avatarUrl.secure_url) {
        throw new ApiError(500, "Something went wrong while updating avatar");
    }

    //update the avatar in the database
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: { avatar: avatarUrl.secure_url }
    },
        { new: true }
    ).select("-password -refreshToken -createdAt -updatedAt");
    
    return res.status(200).json(
        new ApiResponse(200, user, "User avatar updated successfully")
    );
});


//update user cover image
const updateUserCoverImage = asyncHandler(async (req, res) => {
    // -------Rules for update user cover image flow-------
    //get the user from the request object
    //get the cover image from the request body
    //update the cover image
    //send the response

    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing");
    }

    //upload the cover image to cloudinary
    const coverImageUrl = await uploadImageToCloudinary(coverImageLocalPath);
    if (!coverImageUrl.secure_url) {
        throw new ApiError(500, "Something went wrong while updating cover image");
    }
    
    //update the cover image in the database
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: { coverImage: coverImageUrl.secure_url }
    },
        { new: true }
    ).select("-password -refreshToken -createdAt -updatedAt");
    return res.status(200).json(
        new ApiResponse(200, user, "User cover image updated successfully")
    );

});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentUserPassword,
    getCurrentUser,
    updateCurrentUser,
    updateUserAvatar,
    updateUserCoverImage

};