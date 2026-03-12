//video routes--->to handle the video related requests
import { Router } from "express";
import { publishVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus, getAllVideos, getVideosByUserId } from "../controllers/video.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
const router = Router();
//routes declaration
router
  .route("/")
  .get(authMiddleware, getAllVideos)
  .post(
    authMiddleware,
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    publishVideo,
  );
router.route("/user/:userId").get(authMiddleware, getVideosByUserId);
router.route("/:videoId").get(authMiddleware, getVideoById);
router.route("/:videoId").put(authMiddleware, updateVideo);
router.route("/:videoId").delete(authMiddleware, deleteVideo);
router.route("/:videoId/toggle").post(authMiddleware, togglePublishStatus);

export default router;