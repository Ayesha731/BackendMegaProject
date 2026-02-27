import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullName, password } = req.body;
    if (!username || !email || !fullName || !password) {
        throw new ApiError(400, "All fields are required");
    }
    const user = await User.findOne({ email });

    if (user) {
        throw new ApiError(400, "User already exists");
    }
    const newUser = await User.create({ username, email, fullName, password });
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();
    newUser.refreshToken = refreshToken;
    await newUser.save();
     res.status(201).json(
        {
            success: true,
            message: "User registered successfully",
            data: {
                accessToken,
                refreshToken,
            },
        }
    );
});

export default registerUser;








