//subscription routes--->to handle the subscription related requests
import { Router } from "express";
import { subscribeToChannel, unsubscribeFromChannel, getSubscribers, getSubscriptions } from "../controllers/subscription.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();
//routes declaration
router.route("/channel/:channelId").post(authMiddleware, subscribeToChannel);
router.route("/channel/:channelId").delete(authMiddleware, unsubscribeFromChannel);
router.route("/channel/:channelId/subscribers").get(authMiddleware, getSubscribers);
router.route("/user/:userId").get(authMiddleware, getSubscriptions);
export default router;