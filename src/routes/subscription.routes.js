//subscription routes--->to handle the subscription related requests
import { Router } from "express";
import { subscribeToChannel, unsubscribeFromChannel, getSubscribers, getSubscriptions } from "../controllers/subscription.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();
//routes declaration
router.route("/:channelId").post(authMiddleware, subscribeToChannel);
router.route("/:channelId").delete(authMiddleware, unsubscribeFromChannel);
router.route("/:channelId").get(authMiddleware, getSubscribers);
router.route("/:userId").get(authMiddleware, getSubscriptions);
export default router;