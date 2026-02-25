import express from "express";
import { Register, Login, Profile,UpdateProfileImage } from "../controllers/AuthContoller.js";
import  authMiddleware  from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import uploadConfig from "../config/uploadConfig.js";
import { ForgotPassword, VerifyOTP, ResetPassword } from "../controllers/ForgotContoller.js";

const authRouter = express.Router();

authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.post("/forgotPassword", ForgotPassword);
authRouter.post("/verifyOTP", VerifyOTP);
authRouter.put("/resetPassword", ResetPassword);
authRouter.get("/profile", authMiddleware, roleMiddleware(["user", "admin"]), Profile);
authRouter.put("/profile/image",authMiddleware,uploadConfig.single('profile_pic'),UpdateProfileImage);
export default authRouter