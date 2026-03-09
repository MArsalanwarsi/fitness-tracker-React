import User from "../models/authModel.js";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const UNIT_LABEL = {
    water: "L",
    steps: "steps",
    calories: "kcal",
    sleep: "h",
    weight: "kg",
    workout: "min",
};

const fmt12h = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/**
 * Returns the weeklyStats array index for the current day.
 * Array layout: [Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6]
 *
 * JS getDay():  Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
 * Formula:      (getDay() + 6) % 7  →  Mon=0 … Sun=6
 */
const getTodayIndex = () => (new Date().getDay() + 6) % 7;

// ─────────────────────────────────────────────────────────────────────────────
// GET FULL DASHBOARD
// GET /api/dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const getDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "name profile_pic goals weeklyStats macros bmi waterGlasses mood streak activityLogs workouts"
        );
        if (!user) return res.status(404).json({ error: "User not found" });

        return res.status(200).json({
            success: true,
            dashboard: {
                name: user.name,
                profile_pic: user.profile_pic,
                goals: user.goals,
                weeklyStats: user.weeklyStats,
                macros: user.macros,
                bmi: user.bmi,
                waterGlasses: user.waterGlasses,
                mood: user.mood,
                streak: user.streak,
                activityLogs: user.activityLogs.sort((a, b) => new Date(b.date) - new Date(a.date)),
                workouts: user.workouts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
                todayIndex: getTodayIndex(), // send to frontend so charts can highlight today
            },
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE GOALS
// PUT /api/dashboard/goals
// ─────────────────────────────────────────────────────────────────────────────
export const updateGoals = async (req, res) => {
    try {
        const { water, calories, steps, sleep, protein, carbs, fat } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (water !== undefined) user.goals.water = water;
        if (calories !== undefined) user.goals.calories = calories;
        if (steps !== undefined) user.goals.steps = steps;
        if (sleep !== undefined) user.goals.sleep = sleep;
        if (protein !== undefined) user.goals.protein = protein;
        if (carbs !== undefined) user.goals.carbs = carbs;
        if (fat !== undefined) user.goals.fat = fat;

        await user.save();
        return res.status(200).json({ success: true, goals: user.goals });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// LOG ACTIVITY
// POST /api/dashboard/log
// Body: { type, value, note?, caloriesOverride? }
// ─────────────────────────────────────────────────────────────────────────────
export const logActivity = async (req, res) => {
    try {
        const { type, value, note = "", caloriesOverride } = req.body;
        const VALID = ["water", "steps", "calories", "sleep", "weight", "workout"];

        if (!VALID.includes(type))
            return res.status(400).json({ error: `Invalid type. Must be one of: ${VALID.join(", ")}` });
        if (value === undefined || isNaN(Number(value)))
            return res.status(400).json({ error: "value must be a number" });

        const val = Number(value);
        const today = getTodayIndex(); // ← correct day slot (Mon=0 … Sun=6)
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // ── Update the correct day slot in weeklyStats ────────────────────────
        if (type === "sleep") {
            // Sleep is a replacement, not cumulative
            user.weeklyStats.sleep[today] = val;

        } else if (type === "weight") {
            // Weight is a replacement
            user.weeklyStats.weight[today] = val;
            user.bmi.weight = val;

        } else if (type === "workout") {
            // Workout has no dedicated stat array — handled separately below

        } else {
            // water / steps / calories — accumulate during the day
            user.weeklyStats[type][today] = (user.weeklyStats[type][today] || 0) + val;
        }
        user.markModified("weeklyStats");

        // ── Side-effects ──────────────────────────────────────────────────────
        if (type === "water") {
            user.waterGlasses = Math.min(user.waterGlasses + Math.round(val * 4), 8);
        }

        if (type === "calories") {
            user.macros.protein = (user.macros.protein || 0) + Math.round(val * 0.25);
            user.macros.carbs = (user.macros.carbs || 0) + Math.round(val * 0.45);
            user.macros.fat = (user.macros.fat || 0) + Math.round((val * 0.30) / 9);
        }

        if (type === "workout") {
            user.workouts.unshift({
                name: note || "Workout",
                duration: Math.round(val),
                calories: caloriesOverride
                    ? Math.round(Number(caloriesOverride))
                    : Math.round(val * 6),
                date: "Today",
            });
        }

        // ── Activity log entry ────────────────────────────────────────────────
        user.activityLogs.unshift({
            type: type.charAt(0).toUpperCase() + type.slice(1),
            amount: `${val} ${UNIT_LABEL[type] ?? ""}`.trim(),
            value: val,
            note,
            time: fmt12h(),
            date: new Date(),
        });
        if (user.activityLogs.length > 50)
            user.activityLogs = user.activityLogs.slice(0, 50);

        await user.save();

        return res.status(201).json({
            success: true,
            message: `${type} logged`,
            log: user.activityLogs[0],
            weeklyStats: user.weeklyStats,
            macros: user.macros,
            waterGlasses: user.waterGlasses,
            workouts: user.workouts,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE ACTIVITY LOG ENTRY
// DELETE /api/dashboard/log/:logId
// ─────────────────────────────────────────────────────────────────────────────
export const deleteActivityLog = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const before = user.activityLogs.length;
        user.activityLogs = user.activityLogs.filter(
            (l) => l._id.toString() !== req.params.logId
        );
        if (user.activityLogs.length === before)
            return res.status(404).json({ error: "Log entry not found" });

        await user.save();
        return res.status(200).json({ success: true, message: "Log entry deleted" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE WORKOUT
// DELETE /api/dashboard/workouts/:workoutId
// ─────────────────────────────────────────────────────────────────────────────
export const deleteWorkout = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const before = user.workouts.length;
        user.workouts = user.workouts.filter(
            (w) => w._id.toString() !== req.params.workoutId
        );
        if (user.workouts.length === before)
            return res.status(404).json({ error: "Workout not found" });

        await user.save();
        return res.status(200).json({ success: true, message: "Workout deleted" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE MOOD
// PUT /api/dashboard/mood
// ─────────────────────────────────────────────────────────────────────────────
export const updateMood = async (req, res) => {
    try {
        const { mood } = req.body;
        if (!["bad", "ok", "good"].includes(mood))
            return res.status(400).json({ error: "mood must be bad, ok, or good" });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { mood },
            { new: true, select: "mood" }
        );
        if (!user) return res.status(404).json({ error: "User not found" });

        return res.status(200).json({ success: true, mood: user.mood });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE BMI
// PUT /api/dashboard/bmi
// ─────────────────────────────────────────────────────────────────────────────
export const updateBmi = async (req, res) => {
    try {
        const { height, weight } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (height !== undefined) user.bmi.height = height;
        if (weight !== undefined) {
            user.bmi.weight = weight;
            user.weeklyStats.weight[getTodayIndex()] = weight; // ← correct slot
            user.markModified("weeklyStats");
        }

        await user.save();
        return res.status(200).json({ success: true, bmi: user.bmi });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE WATER GLASSES
// PUT /api/dashboard/water-glasses
// ─────────────────────────────────────────────────────────────────────────────
export const updateWaterGlasses = async (req, res) => {
    try {
        const count = Number(req.body.count);
        if (isNaN(count) || count < 0 || count > 8)
            return res.status(400).json({ error: "count must be 0-8" });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { waterGlasses: count },
            { new: true, select: "waterGlasses" }
        );
        if (!user) return res.status(404).json({ error: "User not found" });

        return res.status(200).json({ success: true, waterGlasses: user.waterGlasses });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE WEEKLY STATS (manual correction)
// PUT /api/dashboard/weekly-stats
// ─────────────────────────────────────────────────────────────────────────────
export const updateWeeklyStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const keys = ["water", "calories", "steps", "sleep", "weight"];
        keys.forEach((k) => {
            if (Array.isArray(req.body[k]) && req.body[k].length === 7)
                user.weeklyStats[k] = req.body[k];
        });
        user.markModified("weeklyStats");

        await user.save();
        return res.status(200).json({ success: true, weeklyStats: user.weeklyStats });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// RESET TODAY'S SLOT (call once per day, e.g. via cron or on login)
// POST /api/dashboard/reset-today
//
// Instead of shifting the whole array (which broke day alignment),
// we zero out only today's index so yesterday's data stays intact.
// ─────────────────────────────────────────────────────────────────────────────
export const resetTodayStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const today = getTodayIndex();

        // Zero out only today's slot — other days are untouched
        ["water", "calories", "steps", "sleep", "weight"].forEach((k) => {
            user.weeklyStats[k][today] = 0;
        });
        user.markModified("weeklyStats");

        // Reset daily accumulation fields
        user.macros = { protein: 0, carbs: 0, fat: 0 };
        user.waterGlasses = 0;

        // Advance streak: mark yesterday as completed, reset today marker
        const yesterday = (today + 6) % 7; // one step back in Mon-Sun ring
        const week = [...(user.streak.week ?? [0, 0, 0, 0, 0, 0, 0])];
        week[yesterday] = 1;          // yesterday = done
        week[today] = "today";    // today = current
        user.streak.week = week;
        user.streak.count = (user.streak.count || 0) + 1;
        user.markModified("streak");

        await user.save();
        return res.status(200).json({
            success: true,
            message: "Today reset",
            weeklyStats: user.weeklyStats,
            macros: user.macros,
            waterGlasses: user.waterGlasses,
            streak: user.streak,
            todayIndex: today,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};