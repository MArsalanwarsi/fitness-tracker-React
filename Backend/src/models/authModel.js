import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
});

const dailyLogSchema = new mongoose.Schema({
    date: { type: Date, required: true, default: () => new Date().setHours(0, 0, 0, 0) },
    breakfast: [foodItemSchema],
    lunch: [foodItemSchema],
    dinner: [foodItemSchema],
});

const activityLogSchema = new mongoose.Schema({
    type: { type: String, required: true }, 
    amount: { type: String, required: true }, 
    value: { type: Number, required: true }, 
    note: { type: String, default: "" },
    time: { type: String },                
    date: { type: Date, default: Date.now },
});

const workoutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    calories: { type: Number, default: 0 },
    date: { type: String, default: "Today" },
}, { timestamps: true });

const weeklyStatsSchema = new mongoose.Schema({
    water: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
    calories: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
    steps: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
    sleep: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
    weight: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
}, { _id: false });

const goalsSchema = new mongoose.Schema({
    water: { type: Number, default: 3 },
    calories: { type: Number, default: 2500 },
    steps: { type: Number, default: 10000 },
    sleep: { type: Number, default: 8 },
    protein: { type: Number, default: 150 },
    carbs: { type: Number, default: 280 },
    fat: { type: Number, default: 80 },
}, { _id: false });

const macrosSchema = new mongoose.Schema({
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
}, { _id: false });

const bmiSchema = new mongoose.Schema({
    height: { type: Number, default: 170 }, 
    weight: { type: Number, default: 70 },  
}, { _id: false });


const streakSchema = new mongoose.Schema({
    week: {
        type: [mongoose.Schema.Types.Mixed],
        default: [0, 0, 0, 0, 0, 0, "today"],
    },
    count: { type: Number, default: 0 },
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_pic: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    goals: { type: goalsSchema, default: () => ({}) },
    weeklyStats: { type: weeklyStatsSchema, default: () => ({}) },
    macros: { type: macrosSchema, default: () => ({}) },
    bmi: { type: bmiSchema, default: () => ({}) },
    waterGlasses: { type: Number, default: 0, min: 0, max: 8 },
    mood: { type: String, enum: ["bad", "ok", "good"], default: "good" },
    streak: { type: streakSchema, default: () => ({}) },

    activityLogs: [activityLogSchema],
    workouts: [workoutSchema],

    nutrition: {
        breakfast: [foodItemSchema],
        lunch: [foodItemSchema],
        dinner: [foodItemSchema],
        snacks: [foodItemSchema],
    },
    nutritionLogs: [dailyLogSchema],

}, { timestamps: true });

export default mongoose.model("User", userSchema);