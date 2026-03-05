//comment routes--->to handle the comment related requests

import { Router } from "express";
import { getVideoComments, addComment, updateComment, deleteComment } from "../controllers/comment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();

//apply the auth middleware to the all in this file routes
//so that we don't have to apply the auth middleware to each route
router.use(authMiddleware);

//routes declaration
router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/:commentId").put(updateComment).delete(deleteComment);
export default router;