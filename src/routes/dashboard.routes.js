//dashboard routes--->to handle the dashboard related requests
import { Router } from "express";
import { getChannelStats, getChannelVideos, getTopVideos, getChannelAnalytics } from "../controllers/dashboard.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();
//routes declaration


router.route("/channel/:channelId").get(authMiddleware, getChannelStats);
//get all videos uploaded by the channel
router.route("/channel/:channelId/videos").get(authMiddleware, getChannelVideos);

router.route("/channel/:channelId/top-videos").get(authMiddleware, getTopVideos);
//get channel analytics over time
router.route("/channel/:channelId/analytics").get(authMiddleware, getChannelAnalytics);
export default router;