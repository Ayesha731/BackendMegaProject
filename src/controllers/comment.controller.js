//comment controller--->to handle the comment related requests
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Comment from "../models/comment.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

//getVideoComments
const getVideoComments = asyncHandler(async (req, res) => {
    // -------Rules for get video comments flow-------
    //get the video id from the request parameters
    //find the comments
    //return the comments
    const { videoId } = req.params;
    const comments = await Comment.find({ video: new mongoose.Types.ObjectId(videoId) });
    if(!comments){
        throw new ApiError(404, "Comments not found");
    }
    return res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

//add a comment
const addComment = asyncHandler(async (req, res) => {
    // -------Rules for add comment flow-------
    //get the video id from the request parameters
    //get the comment from the request body
    //create a new comment object
    //save the comment object to the database
    //return the comment object
    const { videoId } = req.params;
    const { content } = req.body;
    const comment = await Comment.create({ video: new mongoose.Types.ObjectId(videoId), content: content, owner: req.user._id });
    if(!comment){
        throw new ApiError(500, "Something went wrong while adding comment");
    }
    return res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"));
});

//update a comment
const updateComment = asyncHandler(async (req, res) => {
    // -------Rules for update comment flow-------
    //get the comment id from the request parameters
    //get the comment from the request body
//update the comment object
    const { commentId } = req.params;
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    return res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"));
});

//delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    // -------Rules for delete comment flow-------
    //get the comment id from the request parameters
    //delete the comment object
    const { commentId } = req.params;
    const comment = await Comment.findByIdAndDelete(commentId);
    if(!comment){
        throw new ApiError(404, "Comment not found");
    }
    return res.status(200).json(new ApiResponse(200, comment, "Comment deleted successfully"));
});
export { getVideoComments, addComment, updateComment, deleteComment };