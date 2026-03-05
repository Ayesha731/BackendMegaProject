//video controller--->to handle the video related requests
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Video from "../models/video.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadVideoToCloudinary, uploadImageToCloudinary } from "../utils/cloudinary.js";

//get all videos
const getAllVideos = asyncHandler(async (req, res) => {
// -------Rules for get all videos flow-------
    //get the page and limit from the query parameters
    //find the videos
    //return the videos
    const { page = 1, limit = 10,query,sortBy,sortType,userId } = req.query;
    const aggregate = Video.aggregate([
        {
            $match: {
                $or: [{ title: { $regex: query, $options: "i" } }, { description: { $regex: query, $options: "i" } }],
            },
        },
    ]);
    if(sortBy && sortType){
        aggregate.push({ $sort: { [sortBy]: sortType === "asc" ? 1 : -1 } });
    }
    if(userId){
        aggregate.push({ $match: { owner: new mongoose.Types.ObjectId(userId) } });
    }
    const videos = await Video.aggregatePaginate(aggregate, { page, limit });
    return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

//publish a video
const publishVideo = asyncHandler(async (req, res) => {
    // -------Rules for publish video flow-------
    //get the video id from the request body
    //find the video and thumbnail from the request body
    //upload the video and thumbnail to cloudinary
    //create a new video object
    //save the video object to the database
    //calculate the duration of the video from the response of the cloudinary
    //save the duration of the video to the database
    //return the video object
    const { title,description } = req.body;
    const videoLocalPath = req.file?.path;
    if(!videoLocalPath){
        throw new ApiError(400, "Video is required");
    }
    const thumbnailLocalPath = req.file?.path;
    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is required");
    }
    const videoResponse = await uploadVideoToCloudinary(videoLocalPath);
    if(!videoResponse){
        throw new ApiError(500, "Something went wrong while uploading video");
    }
    const thumbnailResponse = await uploadImageToCloudinary(thumbnailLocalPath);
    if(!thumbnailResponse){
        throw new ApiError(500, "Something went wrong while uploading thumbnail");
    }
    const video = await Video.create({ title,description,videoFile: videoResponse.secure_url,thumbnail: thumbnailResponse.secure_url,owner: req.user._id });
    if(!video){
        throw new ApiError(500, "Something went wrong while publishing video");
    }
    return res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

//update a video
const updateVideo = asyncHandler(async (req, res) => {
    // -------Rules for update video flow-------
    //get the video id from the request body
    //find the video
    //update the video
    //return the video
    const { videoId } = req.body;
    const video = await Video.findByIdAndUpdate(videoId, { title, description }, { new: true });
    if(!video){
        throw new ApiError(404, "Video not found");
    }
    return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});

//getVideoById
const getVideoById = asyncHandler(async (req, res) => {
    // -------Rules for get video by id flow-------
    //get the video id from the request parameters
    //find the video
    //return the video
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found");
    }
    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

//delete a video
const deleteVideo = asyncHandler(async (req, res) => {
    // -------Rules for delete video flow-------
    //get the video id from the request parameters
    //find the video
    //delete the video
    //return the video
    const { videoId } = req.params;
    const video = await Video.findByIdAndDelete(videoId);
    if(!video){
        throw new ApiError(404, "Video not found");
    }
    return res.status(200).json(new ApiResponse(200, video, "Video deleted successfully"));
});

//togglePublishStatus
const togglePublishStatus = asyncHandler(async (req, res) => {
    // -------Rules for toggle publish status flow-------
    //get the video id from the request parameters
    //find the video
    //toggle the publish status
    //return the video
    const { videoId } = req.params;
    const video = await Video.findByIdAndUpdate(videoId, { isPublished: !video.isPublished }, { new: true });
    if(!video){
        throw new ApiError(404, "Video not found");
    }
    return res.status(200).json(new ApiResponse(200, video, "Publish status toggled successfully"));
});


export { getAllVideos, publishVideo, updateVideo, getVideoById, deleteVideo, togglePublishStatus };