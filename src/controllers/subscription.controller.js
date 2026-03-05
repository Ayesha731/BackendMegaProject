import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js"; 
import mongoose from "mongoose"; 

//Subscribe to a channel (user)
    // -------Rules for subscribe to channel flow-------
    //get the channel id from the request params
    //find the channel
    //create a new subscription object
    //save the subscription object to the database
    //return the subscription object
const subscribeToChannel = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscription = await Subscription.create({ subscriber: req.user._id, channel: new mongoose.Types.ObjectId(channelId) });
    if(!subscription){
        throw new ApiError(500, "Something went wrong while subscribing to the channel");
    }
    return res.status(200).json(new ApiResponse(200, subscription, "Subscribed to the channel successfully"));
});

//Unsubscribe from a channel
    // -------Rules for unsubscribe from channel flow-------
    //get the channel id from the request params
    //find the channel
    //delete the subscription object
    //return the subscription object
const unsubscribeFromChannel = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }
    
    const subscription = await Subscription.findOneAndDelete({
        subscriber: req.user._id,
        channel: new mongoose.Types.ObjectId(channelId)
    });
    
    if (!subscription) {
        throw new ApiError(404, "Subscription not found");
    }
    
    return res.status(200).json(new ApiResponse(200, subscription, "Unsubscribed from the channel successfully"));
});

//Get all subscribers of a channel
    // -------Rules for get subscribers of channel flow-------
    //get the channel id from the request params
    //find the channel
    //find the subscribers
    //return the subscribers
const getSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscribers = await Subscription.find({ channel: new mongoose.Types.ObjectId(channelId) }).populate("subscriber", "username avatar fullName");
    if(!subscribers){
        throw new ApiError(404, "Subscribers not found");
    }
    return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));
});

//Get all subscriptions of a user (channels they subscribe to)
    // -------Rules for get subscriptions of user flow-------
    //get the user id from the request params
    //find the user
    //find the subscriptions
    //return the subscriptions
const getSubscriptions = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    const subscriptions = await Subscription.find({
        subscriber: new mongoose.Types.ObjectId(userId)
    }).populate("channel", "username avatar fullName email");
    
    if (!subscriptions) {
        throw new ApiError(404, "Subscriptions not found");
    }
    
    return res.status(200).json(new ApiResponse(200, subscriptions, "Subscriptions fetched successfully"));
});

export { subscribeToChannel, unsubscribeFromChannel, getSubscribers, getSubscriptions };