//tweet controller--->to handle the tweet related requests
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Tweet from "../models/tweet.model.js";
import mongoose from "mongoose";

//create a tweet
const createTweet = asyncHandler(async (req, res) => {
    // -------Rules for create tweet flow-------
    //get the content from the request body
    //create a new tweet object
    //save the tweet object to the database
    //return the tweet object
    const { content } = req.body;
    const tweet = await Tweet.create({ content, owner: req.user._id });
    if(!tweet){
        throw new ApiError(500, "Something went wrong while creating tweet");
    }
    return res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

//getUserTweets
const getUserTweets = asyncHandler(async (req, res) => {
    // -------Rules for get user tweets flow-------
    //get the user id from the request parameters
    //find the tweets
    //return the tweets
    const { userId } = req.params;
    const tweets = await Tweet.find({ owner: new mongoose.Types.ObjectId(userId) });
    if(!tweets){
        throw new ApiError(404, "Tweets not found");
    }
    return res.status(200).json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

//getTweetById
const getTweetById = asyncHandler(async (req, res) => {
    // -------Rules for get tweet by id flow-------
    //get the tweet id from the request parameters
    //find the tweet
    //return the tweet
    const { tweetId } = req.params;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }
    return res.status(200).json(new ApiResponse(200, tweet, "Tweet fetched successfully"));
});

//update a tweet
const updateTweet = asyncHandler(async (req, res) => {
    // -------Rules for update tweet flow-------
    //get the tweet id from the request parameters
    //get the content from the request body
    //update the tweet object
    //save the tweet object to the database
    //return the tweet object
    const { tweetId } = req.params;
    const { content } = req.body;
    const tweet = await Tweet.findByIdAndUpdate(tweetId, { content }, { new: true });
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }
    return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

//delete a tweet
const deleteTweet = asyncHandler(async (req, res) => {
    // -------Rules for delete tweet flow-------
    //get the tweet id from the request parameters
    //delete the tweet object
    const { tweetId } = req.params;
    const tweet = await Tweet.findByIdAndDelete(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }
    return res.status(200).json(new ApiResponse(200, tweet, "Tweet deleted successfully"));
});
export {
    createTweet, getUserTweets, getTweetById, updateTweet,
    deleteTweet
};