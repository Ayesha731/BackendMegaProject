//tweet routes--->to handle the tweet related requests
import { Router } from "express";
import { createTweet, getUserTweets, getTweetById, updateTweet, deleteTweet } from "../controllers/tweet.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();
//routes declaration
router.route("/").post(authMiddleware, createTweet);
router.route("/:userId").get(authMiddleware, getUserTweets);
router.route("/:tweetId").get(authMiddleware, getTweetById);
router.route("/:tweetId").put(authMiddleware, updateTweet);
router.route("/:tweetId").delete(authMiddleware, deleteTweet);
export default router;