import mongoose from "mongoose";

// ── Reusable sub-schemas ──────────────────────────────────────────────────────

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

// ── Activity log entry (water, steps, calories, sleep, weight, workout) ───────
const activityLogSchema = new mongoose.Schema({
    type: { type: String, required: true }, // "Water" | "Steps" | "Calories" | "Sleep" | "Weight" | "Workout"
    amount: { type: String, required: true }, // human-readable e.g. "500 ml"
    value: { type: Number, required: true }, // raw numeric value
    note: { type: String, default: "" },
    time: { type: String },                 // "09:30 AM"
    date: { type: Date, default: Date.now },
});

// ── Workout entry ─────────────────────────────────────────────────────────────
const workoutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    duration: { type: Number, required: true }, // minutes
    calories: { type: Number, default: 0 },
    date: { type: String, default: "Today" },
}, { timestamps: true });

// ── Weekly stats (7-element arrays, index 6 = today) ─────────────────────────
const weeklyStatsSchema = new mongoose.Schema({
    water: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
    calories: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
    steps: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
    sleep: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
    weight: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
}, { _id: false });

// ── Goals ─────────────────────────────────────────────────────────────────────
const goalsSchema = new mongoose.Schema({
    water: { type: Number, default: 3 },
    calories: { type: Number, default: 2500 },
    steps: { type: Number, default: 10000 },
    sleep: { type: Number, default: 8 },
    protein: { type: Number, default: 150 },
    carbs: { type: Number, default: 280 },
    fat: { type: Number, default: 80 },
}, { _id: false });

// ── Macros (today's totals) ───────────────────────────────────────────────────
const macrosSchema = new mongoose.Schema({
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
}, { _id: false });

// ── BMI data ──────────────────────────────────────────────────────────────────
const bmiSchema = new mongoose.Schema({
    height: { type: Number, default: 170 }, // cm
    weight: { type: Number, default: 70 },  // kg
}, { _id: false });

// ── Streak entry ──────────────────────────────────────────────────────────────
// 7-element array: 0 = missed, 1 = completed, "today" = current day
const streakSchema = new mongoose.Schema({
    week: {
        type: [mongoose.Schema.Types.Mixed],
        default: [0, 0, 0, 0, 0, 0, "today"],
    },
    count: { type: Number, default: 0 },
}, { _id: false });

// ── Main User schema ──────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_pic: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // ── Dashboard data ──────────────────────────────────────────────────────────
    goals: { type: goalsSchema, default: () => ({}) },
    weeklyStats: { type: weeklyStatsSchema, default: () => ({}) },
    macros: { type: macrosSchema, default: () => ({}) },
    bmi: { type: bmiSchema, default: () => ({}) },
    waterGlasses: { type: Number, default: 0, min: 0, max: 8 },
    mood: { type: String, enum: ["bad", "ok", "good"], default: "good" },
    streak: { type: streakSchema, default: () => ({}) },

    // ── Logs & workouts ─────────────────────────────────────────────────────────
    activityLogs: [activityLogSchema],
    workouts: [workoutSchema],

    // ── Nutrition (existing) ────────────────────────────────────────────────────
    nutrition: {
        breakfast: [foodItemSchema],
        lunch: [foodItemSchema],
        dinner: [foodItemSchema],
        snacks: [foodItemSchema],
    },
    nutritionLogs: [dailyLogSchema],

}, { timestamps: true });

export default mongoose.model("User", userSchema);