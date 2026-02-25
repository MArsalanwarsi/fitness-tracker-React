import "dotenv/config"
import otpGenerator  from "otp-generator";
import forgotPassModel from "../models/forgotPassModel.js";
import User from "../models/authModel.js";
import { sendEmail } from "../config/mailerConfig.js";
import bcrypt from "bcrypt"


const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Invalid Email" });
        }
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        const existingOTP = await forgotPassModel.findOne({ email });
        if (existingOTP) {
            await forgotPassModel.findOneAndUpdate({ email }, { otp});
        } else{
            await forgotPassModel.create({ email, otp });
        }
        sendEmail(email, "Password Reset OTP", `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* General Styles */
        body { margin: 0; padding: 0; background-color: #0a0a0a; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        img { display: block; max-width: 100%; border: none; outline: none; }
        
        /* Responsive tweaks */
        @media screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .otp-box { font-size: 24px !important; letter-spacing: 5px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a;">
    <center>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0a0a0a;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #111111; border: 1px solid #333333;">
                        
                        <tr>
                            <td background="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" bgcolor="#000000" width="600" height="240" valign="middle" style="background-size: cover; background-position: center;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" height="240" style="background-color: rgba(0,0,0,0.80);">
                                    <tr>
                                        <td align="center" valign="middle" style="padding: 20px;">
                                            <h1 style="color: #ffffff; margin: 0; text-transform: uppercase; letter-spacing: 3px; font-size: 28px; font-weight: 900; text-shadow: 2px 2px 15px #000000;">
                                                RESET YOUR <span style="color: #ccff00;">POWER</span>
                                            </h1>
                                            <p style="color: #bbbbbb; margin: 10px 0 0 0; font-size: 16px; font-weight: bold; text-transform: uppercase;">Lost your momentum?</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding: 40px 30px;">
                                <p style="font-size: 16px; line-height: 24px; color: #cccccc; margin: 0;">
                                    We received a request to reset your password. Use the code below to get back to your grind. This code expires in <span style="color: #ccff00; font-weight: bold;">10 minutes</span>.
                                </p>
                                
                                <table border="0" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center" bgcolor="#ccff00" style="padding: 15px 40px; border-radius: 4px;">
                                            <span style="color: #000000; font-size: 36px; font-weight: 800; letter-spacing: 10px;">${otp}</span>
                                        </td>
                                    </tr>
                                </table>

                                <p style="font-size: 14px; color: #666666; margin: 0;">
                                    If you didn't request this, you can safely ignore this email.<br>Your gains are still secure.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding: 0 30px 30px 30px;">
                                <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=540&q=80" width="540" alt="Training" style="border-radius: 8px; border: 1px solid #333333;">
                            </td>
                        </tr>

                        <tr>
                            <td align="center" bgcolor="#0a0a0a" style="padding: 30px; border-top: 1px solid #222222;">
                                <p style="font-size: 14px; color: #ffffff; font-weight: bold; margin: 0; letter-spacing: 1px;">Fitness Tracker</p>
                                <p style="font-size: 11px; color: #555555; margin: 10px 0 0 0; line-height: 18px;">
                                    123 Muscle Way, Iron City, IC 54321<br>
                                    You received this because you are a member of Fitness Tracker.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>`);
        res.status(200).json({ message: "OTP has been sent to your email",email:email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const VerifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }
        const record = await forgotPassModel.findOne({ email, otp });
        if (!record) {
            return res.status(400).json({ error: "Invalid OTP" });
        }
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const ResetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ error: "Email and new password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateuser = await User.findByIdAndUpdate(user._id, {
                    $set: { password: hashedPassword }
                }, { new: true });
        if(!updateuser){
            res.status(500).json({message:"Something went wrong"});
        }
        sendEmail(email, "Password Reset Successful", `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* General Styles */
        body { margin: 0; padding: 0; background-color: #0a0a0a; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        img { display: block; max-width: 100%; border: none; outline: none; }
        
        /* Responsive tweaks */
        @media screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .status-text { font-size: 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a;">
    <center>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0a0a0a;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #111111; border: 1px solid #333333;">
                        
                        <tr>
                            <td background="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=600&q=80" bgcolor="#000000" width="600" height="200" valign="middle" style="background-size: cover; background-position: center;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" height="200" style="background-color: rgba(0,0,0,0.75);">
                                    <tr>
                                        <td align="center" valign="middle" style="padding: 20px;">
                                            <h1 style="color: #ffffff; margin: 0; text-transform: uppercase; letter-spacing: 3px; font-size: 24px; font-weight: 900; text-shadow: 2px 2px 10px #000000;">
                                                PASSWORD <span style="color: #ccff00;">UPDATED</span>
                                            </h1>
                                            <p style="color: #bbbbbb; margin: 10px 0 0 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Security confirmation</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding: 40px 40px 30px 40px;">
                                <div style="margin-bottom: 25px;">
                                    <img src="https://cdn-icons-png.flaticon.com/128/1047/1047711.png" width="50" height="50" alt="Success" style="filter: brightness(0) saturate(100%) invert(86%) sepia(94%) saturate(417%) hue-rotate(18deg) brightness(103%) contrast(104%);">
                                </div>
                                
                                <p style="font-size: 18px; color: #ffffff; font-weight: bold; margin: 0 0 15px 0;">
                                    Your password was successfully changed.
                                </p>
                                
                                <p style="font-size: 15px; line-height: 24px; color: #aaaaaa; margin: 0;">
                                    This is a confirmation that the password for your **Fitness Tracker** account has been updated. You can now use your new password to log in to your dashboard and resume your training.
                                </p>

                                <table border="0" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center" bgcolor="#ccff00" style="padding: 14px 30px; border-radius: 4px;">
                                            <a href="https://yourwebsite.com/login" style="color: #000000; font-size: 16px; font-weight: 800; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">Login to Account</a>
                                        </td>
                                    </tr>
                                </table>

                                <hr style="border: 0; border-top: 1px solid #222222; margin: 20px 0;">

                                <p style="font-size: 13px; color: #666666; margin: 0; line-height: 20px;">
                                    <strong>Didn't make this change?</strong><br>
                                    If you did not change your password, please contact our security team immediately or <a href="#" style="color: #ccff00; text-decoration: none;">secure your account here</a> to prevent unauthorized access.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" bgcolor="#0a0a0a" style="padding: 30px; border-top: 1px solid #222222;">
                                <p style="font-size: 14px; color: #ffffff; font-weight: bold; margin: 0; letter-spacing: 1px;">Fitness Tracker</p>
                                <p style="font-size: 11px; color: #555555; margin: 10px 0 0 0; line-height: 18px;">
                                    123 Muscle Way, Iron City, IC 54321<br>
                                    © 2026 Fitness Tracker. All rights reserved.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>`)
        res.status(200).json({ message: "Password reset successful"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
};

export { ForgotPassword, VerifyOTP, ResetPassword };

