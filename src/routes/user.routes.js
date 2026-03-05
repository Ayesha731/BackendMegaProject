import { Router } from "express";
import {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentUserPassword, getCurrentUser, updateCurrentUser, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();
//routes declaration
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
         },
        {
            name: "coverImage",
            maxCount: 2    
         }]), 
    registerUser);

router.route("/login").post(loginUser);

//secured routes--->where userlogin is mandatory
router.route("/logout").post(authMiddleware, logoutUser);
router.route("/refresh-access-token").post(refreshAccessToken);

//user routes
router.route("/change-password").post(authMiddleware, changeCurrentUserPassword);
router.route("/get-current-user").get(authMiddleware, getCurrentUser);
router.route("/update-current-user").patch(authMiddleware, updateCurrentUser);
router.route("/update-user-avatar").patch(authMiddleware, upload.single("avatar"), updateUserAvatar);
router.route("/update-user-cover-image").patch(authMiddleware, upload.single("coverImage"), updateUserCoverImage);
router.route("/get-user-channel-profile/:username").get(authMiddleware, getUserChannelProfile);
router.route("/get-watch-history").get(authMiddleware, getWatchHistory);


export default router;

