//video routes--->to handle the video related requests
import { Router } from "express";
import { publishVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus, getAllVideos } from "../controllers/video.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();
//routes declaration
router.route("/").post(authMiddleware, publishVideo);
router.route("/:videoId").get(authMiddleware, getVideoById);
router.route("/:videoId").put(authMiddleware, updateVideo);
router.route("/:videoId").delete(authMiddleware, deleteVideo);
router.route("/:videoId/toggle").post(authMiddleware, togglePublishStatus);
router.route("/:userId").get(authMiddleware, getAllVideos);

export default router;