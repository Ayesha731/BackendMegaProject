//like routes--->to handle the like related requests
import { Router } from "express";
import { likeVideo, toggleVideoLike, toggleCommentLike, toggleTweetLike } from "../controllers/like.controller.js";
const router = Router();
//routes declaration
router.route("/video/:videoId").post(likeVideo);
router.route("/video/:videoId/toggle").post(toggleVideoLike);
router.route("/comment/:commentId/toggle").post(toggleCommentLike);
router.route("/tweet/:tweetId/toggle").post(toggleTweetLike);
export default router;