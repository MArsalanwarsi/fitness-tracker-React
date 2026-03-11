import User from "../models/authModel.js";

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

const getTodayIndex = () => (new Date().getDay() + 6) % 7;

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

export const logActivity = async (req, res) => {
    try {
        const { type, value, note = "", caloriesOverride } = req.body;
        const VALID = ["water", "steps", "calories", "sleep", "weight", "workout"];

        if (!VALID.includes(type))
            return res.status(400).json({ error: `Invalid type. Must be one of: ${VALID.join(", ")}` });
        if (value === undefined || isNaN(Number(value)))
            return res.status(400).json({ error: "value must be a number" });

        const val = Number(value);
        const today = getTodayIndex(); 
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (type === "sleep") {
            user.weeklyStats.sleep[today] = val;

        } else if (type === "weight") {
            user.weeklyStats.weight[today] = val;
            user.bmi.weight = val;

        } else if (type === "workout") {

        } else {
            user.weeklyStats[type][today] = (user.weeklyStats[type][today] || 0) + val;
        }
        user.markModified("weeklyStats");
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

export const updateBmi = async (req, res) => {
    try {
        const { height, weight } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (height !== undefined) user.bmi.height = height;
        if (weight !== undefined) {
            user.bmi.weight = weight;
            user.weeklyStats.weight[getTodayIndex()] = weight; 
            user.markModified("weeklyStats");
        }

        await user.save();
        return res.status(200).json({ success: true, bmi: user.bmi });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


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

export const resetTodayStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const today = getTodayIndex();

        ["water", "calories", "steps", "sleep", "weight"].forEach((k) => {
            user.weeklyStats[k][today] = 0;
        });
        user.markModified("weeklyStats");

        user.macros = { protein: 0, carbs: 0, fat: 0 };
        user.waterGlasses = 0;

        const yesterday = (today + 6) % 7;
        const week = [...(user.streak.week ?? [0, 0, 0, 0, 0, 0, 0])];
        week[yesterday] = 1;  
        week[today] = "today";
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