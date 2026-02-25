import User from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config"

const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({message:"User registered successfully",user});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Invalid Credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }
        const token = jwt.sign({ id: user._id,role:user.role },process.env.SECRET_KEY,{expiresIn:"1h"});
        res.status(200).json({message:"User logged in successfully",user,token});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const Profile = async (req, res) => {
    try {
        const userId = req.user.id; 
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error("Profile Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const UpdateProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile_pic = req.file.path;
        const oldUser = await User.findById(userId);
        if (!oldUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = await User.findByIdAndUpdate(userId, {
            $set: { profile_pic: profile_pic }
        }, { new: true }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error("Update Profile Image Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export { Register, Login, Profile, UpdateProfileImage };
