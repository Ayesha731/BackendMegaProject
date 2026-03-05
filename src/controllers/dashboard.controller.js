import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Video from "../models/video.model.js";
import Subscription from "../models/subscription.model.js";
import Like from "../models/like.model.js";
import mongoose from "mongoose";

/**
 * Get channel statistics
 * Returns: total videos, total views, total subscribers, total likes
 */
const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }
    
    // Get total videos by channel
    const totalVideos = await Video.countDocuments({ owner: new mongoose.Types.ObjectId(channelId) });
    
    // Get total views on all videos
    const videos = await Video.find({ owner: new mongoose.Types.ObjectId(channelId) });
    const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
    
    // Get total subscribers
    const totalSubscribers = await Subscription.countDocuments({
        channel: new mongoose.Types.ObjectId(channelId)
    });
    
    // Get total likes on all videos
    const likes = await Like.countDocuments({
        video: { $in: videos.map(v => v._id) }
    });
    
    const stats = {
        totalVideos,
        totalViews,
        totalSubscribers,
        totalLikes: likes
    };
    
    return res.status(200).json(
        new ApiResponse(200, stats, "Channel statistics fetched successfully")
    );
});

/**
 * Get all videos uploaded by the channel
 */
const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }
    
    // Get videos with pagination
    const videos = await Video.find({ owner: new mongoose.Types.ObjectId(channelId) })
        .populate("owner", "username avatar fullName")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    
    // Get total count for pagination info
    const total = await Video.countDocuments({ owner: new mongoose.Types.ObjectId(channelId) });
    
    const response = {
        videos,
        pagination: {
            currentPage: page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalVideos: total
        }
    };
    
    return res.status(200).json(
        new ApiResponse(200, response, "Channel videos fetched successfully")
    );
});

/**
 * Get top videos by views for the channel
 */
const getTopVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { limit = 5 } = req.query;
    
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }
    
    const topVideos = await Video.find({ owner: new mongoose.Types.ObjectId(channelId) })
        .populate("owner", "username avatar fullName")
        .sort({ views: -1 })
        .limit(limit);
    
    return res.status(200).json(
        new ApiResponse(200, topVideos, "Top videos fetched successfully")
    );
});

/**
 * Get channel analytics over time
 * Returns view count trends by date
 */
const getChannelAnalytics = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { days = 30 } = req.query;
    
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }
    
    // Get date from X days ago
    const dateFromPast = new Date();
    dateFromPast.setDate(dateFromPast.getDate() - days);
    
    // Aggregate views by date
    const analytics = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId),
                createdAt: { $gte: dateFromPast }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                totalViews: { $sum: "$views" },
                videoCount: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);
    
    return res.status(200).json(
        new ApiResponse(200, analytics, "Channel analytics fetched successfully")
    );
});

export { getChannelStats, getChannelVideos, getTopVideos, getChannelAnalytics };