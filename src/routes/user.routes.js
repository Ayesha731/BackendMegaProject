import { Router } from "express";
import {registerUser, loginUser, logoutUser, refreshAccessToken} from "../controllers/user.controller.js";
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
export default router;

