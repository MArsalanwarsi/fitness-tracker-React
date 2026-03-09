import User from "../models/authModel.js";


const VALID_MEALS = ["breakfast", "lunch", "dinner", "snacks"];

const todayMidnight = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

const getOrCreateTodayLog = async (user) => {
    const today = todayMidnight();
    let log = user.nutritionLogs.find(
        (l) => new Date(l.date).toDateString() === today.toDateString()
    );
    if (!log) {
        user.nutritionLogs.push({ date: today, breakfast: [], lunch: [], dinner: [] });
        log = user.nutritionLogs[user.nutritionLogs.length - 1];
    }
    return log;
};
export const getNutrition = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id).select("nutrition");
        if (!user) return res.status(404).json({ error: "User not found" });

        return res.status(200).json({ success: true, nutrition: user.nutrition });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const addFoodToMeal = async (req, res) => {
    try {
        const { meal } = req.params;
        if (!VALID_MEALS.includes(meal))
            return res.status(400).json({ error: `Invalid meal. Must be one of: ${VALID_MEALS.join(", ")}` });

        const { name, calories = 0, protein = 0, carbs = 0, fats = 0 } = req.body;
        if (!name?.trim())
            return res.status(400).json({ error: "Food name is required" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const foodItem = { name: name.trim(), calories, protein, carbs, fats };
        user.nutrition[meal].push(foodItem);
        await user.save();

        const addedItem = user.nutrition[meal][user.nutrition[meal].length - 1];
        return res.status(201).json({
            success: true,
            message: `Food added to ${meal}`,
            item: addedItem,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const updateFoodInMeal = async (req, res) => {
    try {
        const { meal, foodId } = req.params;
        if (!VALID_MEALS.includes(meal))
            return res.status(400).json({ error: `Invalid meal. Must be one of: ${VALID_MEALS.join(", ")}` });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const item = user.nutrition[meal].id(foodId);
        if (!item) return res.status(404).json({ error: "Food item not found" });

        const { name, calories, protein, carbs, fats } = req.body;
        if (name !== undefined) item.name = name.trim();
        if (calories !== undefined) item.calories = calories;
        if (protein !== undefined) item.protein = protein;
        if (carbs !== undefined) item.carbs = carbs;
        if (fats !== undefined) item.fats = fats;

        await user.save();
        return res.status(200).json({ success: true, message: "Food item updated", item });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const deleteFoodFromMeal = async (req, res) => {
    try {
        const { meal, foodId } = req.params;
        if (!VALID_MEALS.includes(meal))
            return res.status(400).json({ error: `Invalid meal. Must be one of: ${VALID_MEALS.join(", ")}` });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const before = user.nutrition[meal].length;
        user.nutrition[meal] = user.nutrition[meal].filter(
            (item) => item._id.toString() !== foodId
        );

        if (user.nutrition[meal].length === before)
            return res.status(404).json({ error: "Food item not found" });

        await user.save();
        return res.status(200).json({ success: true, message: "Food item removed" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const clearMeal = async (req, res) => {
    try {
        const { meal } = req.params;
        if (!VALID_MEALS.includes(meal))
            return res.status(400).json({ error: `Invalid meal. Must be one of: ${VALID_MEALS.join(", ")}` });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.nutrition[meal] = [];
        await user.save();

        return res.status(200).json({ success: true, message: `${meal} cleared` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getAllLogs = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("nutritionLogs");
        if (!user) return res.status(404).json({ error: "User not found" });

        let logs = [...user.nutritionLogs].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        if (req.query.from) {
            const from = new Date(req.query.from);
            logs = logs.filter((l) => new Date(l.date) >= from);
        }
        if (req.query.to) {
            const to = new Date(req.query.to);
            to.setHours(23, 59, 59, 999);
            logs = logs.filter((l) => new Date(l.date) <= to);
        }
        if (req.query.limit) {
            logs = logs.slice(0, parseInt(req.query.limit));
        }

        return res.status(200).json({ success: true, count: logs.length, logs });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getTodayLog = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const log = await getOrCreateTodayLog(user);
        await user.save();

        return res.status(200).json({ success: true, log });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


export const getLogById = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("nutritionLogs");
        if (!user) return res.status(404).json({ error: "User not found" });

        const log = user.nutritionLogs.id(req.params.logId);
        if (!log) return res.status(404).json({ error: "Log not found" });

        return res.status(200).json({ success: true, log });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const createLog = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const targetDate = req.body.date ? new Date(req.body.date) : todayMidnight();
        targetDate.setHours(0, 0, 0, 0);

        const existing = user.nutritionLogs.find(
            (l) => new Date(l.date).toDateString() === targetDate.toDateString()
        );
        if (existing)
            return res.status(200).json({
                success: true,
                message: "Log already exists for this date",
                log: existing,
            });

        user.nutritionLogs.push({ date: targetDate, breakfast: [], lunch: [], dinner: [] });
        await user.save();

        const newLog = user.nutritionLogs[user.nutritionLogs.length - 1];
        return res.status(201).json({ success: true, message: "Daily log created", log: newLog });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const addFoodToLog = async (req, res) => {
    try {
        const { logId, meal } = req.params;
        const logMeals = ["breakfast", "lunch", "dinner"]; 
        if (!logMeals.includes(meal))
            return res.status(400).json({ error: `Invalid meal for log. Must be one of: ${logMeals.join(", ")}` });

        const { name, calories = 0, protein = 0, carbs = 0, fats = 0 } = req.body;
        if (!name?.trim())
            return res.status(400).json({ error: "Food name is required" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const log = user.nutritionLogs.id(logId);
        if (!log) return res.status(404).json({ error: "Log not found" });

        const foodItem = { name: name.trim(), calories, protein, carbs, fats };
        log[meal].push(foodItem);
        await user.save();

        const addedItem = log[meal][log[meal].length - 1];
        return res.status(201).json({
            success: true,
            message: `Food added to ${meal} in log`,
            item: addedItem,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


export const updateFoodInLog = async (req, res) => {
    try {
        const { logId, meal, foodId } = req.params;
        const logMeals = ["breakfast", "lunch", "dinner"];
        if (!logMeals.includes(meal))
            return res.status(400).json({ error: `Invalid meal for log. Must be one of: ${logMeals.join(", ")}` });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const log = user.nutritionLogs.id(logId);
        if (!log) return res.status(404).json({ error: "Log not found" });

        const item = log[meal].id(foodId);
        if (!item) return res.status(404).json({ error: "Food item not found" });

        const { name, calories, protein, carbs, fats } = req.body;
        if (name !== undefined) item.name = name.trim();
        if (calories !== undefined) item.calories = calories;
        if (protein !== undefined) item.protein = protein;
        if (carbs !== undefined) item.carbs = carbs;
        if (fats !== undefined) item.fats = fats;

        await user.save();
        return res.status(200).json({ success: true, message: "Food item updated", item });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const deleteFoodFromLog = async (req, res) => {
    try {
        const { logId, meal, foodId } = req.params;
        const logMeals = ["breakfast", "lunch", "dinner"];
        if (!logMeals.includes(meal))
            return res.status(400).json({ error: `Invalid meal for log. Must be one of: ${logMeals.join(", ")}` });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const log = user.nutritionLogs.id(logId);
        if (!log) return res.status(404).json({ error: "Log not found" });

        const before = log[meal].length;
        log[meal] = log[meal].filter((item) => item._id.toString() !== foodId);

        if (log[meal].length === before)
            return res.status(404).json({ error: "Food item not found" });

        await user.save();
        return res.status(200).json({ success: true, message: "Food item removed from log" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const deleteLog = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const log = user.nutritionLogs.id(req.params.logId);
        if (!log) return res.status(404).json({ error: "Log not found" });

        log.deleteOne();
        await user.save();

        return res.status(200).json({ success: true, message: "Daily log deleted" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getTodaySummary = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("nutrition");
        if (!user) return res.status(404).json({ error: "User not found" });

        const summary = { calories: 0, protein: 0, carbs: 0, fats: 0, byMeal: {} };

        VALID_MEALS.forEach((meal) => {
            const mealItems = user.nutrition[meal] || [];
            const mealTotals = mealItems.reduce(
                (acc, item) => ({
                    calories: acc.calories + (item.calories || 0),
                    protein: acc.protein + (item.protein || 0),
                    carbs: acc.carbs + (item.carbs || 0),
                    fats: acc.fats + (item.fats || 0),
                }),
                { calories: 0, protein: 0, carbs: 0, fats: 0 }
            );
            summary.byMeal[meal] = { ...mealTotals, count: mealItems.length };
            summary.calories += mealTotals.calories;
            summary.protein += mealTotals.protein;
            summary.carbs += mealTotals.carbs;
            summary.fats += mealTotals.fats;
        });

        return res.status(200).json({ success: true, summary });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getLogsSummary = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const user = await User.findById(req.user.id).select("nutritionLogs");
        if (!user) return res.status(404).json({ error: "User not found" });

        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        cutoff.setHours(0, 0, 0, 0);

        const recentLogs = user.nutritionLogs
            .filter((l) => new Date(l.date) >= cutoff)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const chartData = recentLogs.map((log) => {
            const allItems = [
                ...(log.breakfast || []),
                ...(log.lunch || []),
                ...(log.dinner || []),
            ];
            return {
                date: new Date(log.date).toISOString().split("T")[0],
                logId: log._id,
                calories: allItems.reduce((s, i) => s + (i.calories || 0), 0),
                protein: allItems.reduce((s, i) => s + (i.protein || 0), 0),
                carbs: allItems.reduce((s, i) => s + (i.carbs || 0), 0),
                fats: allItems.reduce((s, i) => s + (i.fats || 0), 0),
            };
        });

        return res.status(200).json({ success: true, days, data: chartData });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};