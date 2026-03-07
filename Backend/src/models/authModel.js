import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 }
});

const dailyLogSchema = new mongoose.Schema({
    date: { 
        type: Date, 
        required: true, 
        default: () => new Date().setHours(0, 0, 0, 0) // Defaults to today at midnight
    },
    breakfast: [foodItemSchema],
    lunch: [foodItemSchema],
    dinner: [foodItemSchema]
});

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    image: {
        type: String
    },
    email: {
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String, 
        required: true
    },
    profile_pic:{
        type:String,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    nutrition: {
        breakfast: [foodItemSchema],
        lunch: [foodItemSchema],
        dinner: [foodItemSchema],
        snacks: [foodItemSchema] 
    },
    nutritionLogs: [dailyLogSchema]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
