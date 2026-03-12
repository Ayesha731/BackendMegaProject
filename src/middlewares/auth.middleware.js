// write the auth middleware to check if the user is authenticated or not--->user hai k nhi ha
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


const authMiddleware = asyncHandler(async (req, _ , next) => {//_ means we are not using the response object
    // -------Rules for auth middleware-------
    //get the access token from the cookies
    //verify the access token
    //find the user
    //if user is found, then add the user to the request object
    //if user is not found, then throw an error
    //call the next middleware

    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    const accessToken = req.cookies?.accessToken || authHeader?.replace("Bearer ","");//we get this from the cookies because we use cookie parser middleware in app.js file
    //authorization is a header that is used to send the access token in the headers
    //authorization: Bearer <accessToken>
    //we get the access token from the headers by splitting the string at the space and getting the second element
    //split(" ")[1] --> splits the string at the space and gets the second element
    //Bearer <accessToken> --> Bearer is the type of the token and <accessToken> is the token itself
    if (!accessToken) {
        throw new ApiError(401, "Unauthorized Access");
    }
    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);//verify wohi kr pay ga jo hamein generate kiya hai aur secret key bhi hamein generate kiya hai aur yeh wohi token hai jo hamein generate kiya hai aur yeh wohi token hai jo hamein decode kr pay ga
      const user=await User.findById(decodedToken?._id).select("-password -refreshToken -createdAt -updatedAt");
        if (!user) {
        throw new ApiError(401, "Unauthorized Access");
      }
      req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
export default authMiddleware;