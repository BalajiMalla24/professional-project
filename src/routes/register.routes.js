import { registerUser , loginUser, logoutUser , refreshAccessToken } from "../controllers/register.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtUserverify } from "../middlewares/auth.middleware.js";

const userRoutes = Router();

userRoutes.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount:1
            
        } , {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)
    userRoutes.route('/login').post(loginUser)
    userRoutes.route('/logout').post(jwtUserverify , logoutUser)
    userRoutes.route('/refresh-token').post(refreshAccessToken)

export {userRoutes}