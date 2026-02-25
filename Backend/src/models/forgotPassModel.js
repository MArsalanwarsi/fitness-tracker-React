import mongoose from "mongoose";

const forgotPassModel = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model("ForgotPassword", forgotPassModel);