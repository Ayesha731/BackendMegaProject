//playlist routes--->to handle the playlist related requests
import { Router } from "express";
import { createPlaylist, getUserPlaylists, getPlaylistById, updatePlaylist, deletePlaylist, addVideoToPlaylist, removeVideoFromPlaylist } from "../controllers/playlist.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();
//routes declaration
router.route("/").post(authMiddleware, createPlaylist);
router.route("/:userId").get(authMiddleware, getUserPlaylists);
router.route("/:playlistId").get(authMiddleware, getPlaylistById);
router.route("/:playlistId").put(authMiddleware, updatePlaylist);
router.route("/:playlistId").delete(authMiddleware, deletePlaylist);
export default router;