//playlist controller--->to handle the playlist related requests
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Playlist from "../models/playlist.model.js";
import mongoose from "mongoose";

//create a playlist
const createPlaylist = asyncHandler(async (req, res) => {
    // -------Rules for create playlist flow-------
    //get the name and description from the request body
    //create a new playlist object
    //save the playlist object to the database
    //return the playlist object
    const { name, description } = req.body;
    const playlist = await Playlist.create({ name, description, owner: req.user._id });
    if(!playlist){
        throw new ApiError(500, "Something went wrong while creating playlist");
    }
    return res.status(201).json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

//getUserPlaylists
const getUserPlaylists = asyncHandler(async (req, res) => {
    // -------Rules for get user playlists flow-------
    //get the user id from the request parameters
    //find the playlists
    //return the playlists
    const { userId } = req.params;
    const playlists = await Playlist.find({ owner: new mongoose.Types.ObjectId(userId) });
    if(!playlists){
        throw new ApiError(404, "Playlists not found");
    }
    return res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

//getPlaylistById
const getPlaylistById = asyncHandler(async (req, res) => {
    // -------Rules for get playlist by id flow-------
    //get the playlist id from the request parameters
    //find the playlist
    //return the playlist
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

//update a playlist
const updatePlaylist = asyncHandler(async (req, res) => {
    // -------Rules for update playlist flow-------
    //get the playlist id from the request parameters
    //get the name and description from the request body
    //update the playlist object
    //save the playlist object to the database
    //return the playlist object
    const { playlistId } = req.params;
    const { name, description, videos } = req.body;
    const playlist = await Playlist.findByIdAndUpdate(playlistId, { name, description }, { new: true });
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    return res.status(200).json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

//delete a playlist
const deletePlaylist = asyncHandler(async (req, res) => {
    // -------Rules for delete playlist flow-------

    const { playlistId } = req.params;
    const playlist = await Playlist.findByIdAndDelete(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    return res.status(200).json(new ApiResponse(200, playlist, "Playlist deleted successfully"));
});

//add a video to a playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    // -------Rules for add video to playlist flow-------
    //get the playlist id and video id from the request parameters
    //add the video to the playlist
    //return the playlist
    const { playlistId, videoId } = req.params;
    const playlist = await Playlist.findByIdAndUpdate(playlistId, { $push: { videos: new mongoose.Types.ObjectId(videoId) } }, { new: true });
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist successfully"));
});

//remove a video from a playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // -------Rules for remove video from playlist flow-------
    //get the playlist id and video id from the request parameters
    //remove the video from the playlist
    //return the playlist
    const { playlistId, videoId } = req.params;
    const playlist = await Playlist.findByIdAndUpdate(playlistId, { $pull: { videos: new mongoose.Types.ObjectId(videoId) } }, { new: true });
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    return res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist successfully"));
});


export { createPlaylist, getUserPlaylists, getPlaylistById, updatePlaylist, deletePlaylist, addVideoToPlaylist, removeVideoFromPlaylist };