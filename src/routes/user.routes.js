import {Router} from "express";
import { logoutUser, registerUser,loginUser,refreshAccessToken } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.post("/register",
    upload.fields([
        {
           name:"avatar",
              maxCount:1 
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)
//we go to /register and then control goes to registerUser 


    router.route("/login").post(loginUser);


//secured routes
router.route("/logout").post(verifyJWT, logoutUser)

 //refresh token route -- hitting here will give new access token
 router.route("/refresh-token").post(refreshAccessToken)












export default router;