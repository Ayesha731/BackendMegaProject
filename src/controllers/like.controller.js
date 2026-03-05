import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Like from "../models/like.model.js";
import Video from "../models/video.model.js";
import Comment from "../models/comment.model.js";
import Tweet from "../models/tweet.model.js";
import mongoose from "mongoose";

//Like a video
const likeVideo = asyncHandler(async (req, res) => {
    // -------Rules for like video flow-------
    //get the video id from the request params
    //find the video
    //create a new like object
    //save the like object to the database
    //return the like object
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found");
    }
    const like = await Like.create({ video: new mongoose.Types.ObjectId(videoId), likedBy: req.user._id });
    if(!like){
        throw new ApiError(500, "Something went wrong while liking the video");
    }
    return res.status(200).json(new ApiResponse(200, like, "Video liked successfully"));
});

//Toggle video like status
const toggleVideoLike = asyncHandler(async (req, res) => {
    // -------Rules for toggle video like status flow-------
    //get the video id from the request params
    //find the video
    //find the like object
    //if like object exists then delete the like object
    //else create a new like object
    //save the like object to the database
    //return the like object
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found");
    }
    const like = await Like.findOne({ video: new mongoose.Types.ObjectId(videoId), likedBy: req.user._id });
    if(like){
        await Like.findByIdAndDelete(like._id);
    }else{
        await Like.create({ video: new mongoose.Types.ObjectId(videoId), likedBy: req.user._id });
    }
    return res.status(200).json(new ApiResponse(200, like, "Video like status toggled successfully"));
});

//Toggle comment like status
const toggleCommentLike = asyncHandler(async (req, res) => {
    // -------Rules for toggle comment like status flow-------
    //get the comment id from the request params
    //find the comment
    //find the like object
    //if like object exists then delete the like object
    //else create a new like object
    //save the like object to the database
    //return the like object
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404, "Comment not found");
    }
    const like = await Like.findOne({ comment: new mongoose.Types.ObjectId(commentId), likedBy: req.user._id });
    if(like){
        await Like.findByIdAndDelete(like._id);
    }else{
        await Like.create({ comment: new mongoose.Types.ObjectId(commentId), likedBy: req.user._id });
    }
    return res.status(200).json(new ApiResponse(200, like, "Comment like status toggled successfully"));
});

//Toggle tweet like status
    // -------Rules for toggle tweet like status flow-------
    //get the tweet id from the request params
    //find the tweet
    //find the like object
    //if like object exists then delete the like object
    //else create a new like object
    //save the like object to the database
    //return the like object
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }
    const like = await Like.findOne({ tweet: new mongoose.Types.ObjectId(tweetId), likedBy: req.user._id });
    if(like){
        await Like.findByIdAndDelete(like._id);
    }else{
        await Like.create({ tweet: new mongoose.Types.ObjectId(tweetId), likedBy: req.user._id });
    }
    return res.status(200).json(new ApiResponse(200, like, "Tweet like status toggled successfully"));
});
export { likeVideo, toggleVideoLike, toggleCommentLike, toggleTweetLike };