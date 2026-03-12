//like routes--->to handle the like related requests
import { Router } from "express";
import { likeVideo, toggleVideoLike, toggleCommentLike, toggleTweetLike } from "../controllers/like.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();
//routes declaration
router.route("/video/:videoId").post(authMiddleware,likeVideo);
router.route("/video/:videoId/toggle").post(authMiddleware,toggleVideoLike);
router.route("/comment/:commentId/toggle").post(authMiddleware,toggleCommentLike);
router.route("/tweet/:tweetId/toggle").post(authMiddleware,toggleTweetLike);
export default router;