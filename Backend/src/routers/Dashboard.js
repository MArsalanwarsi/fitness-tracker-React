import express from "express";
import {
    getDashboard,
    updateGoals,
    logActivity,
    deleteActivityLog,
    deleteWorkout,
    updateMood,
    updateBmi,
    updateWaterGlasses,
    updateWeeklyStats,
    resetTodayStats,
} from "../controllers/DashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getDashboard);
router.put("/goals", updateGoals);
router.put("/mood", updateMood);
router.put("/bmi", updateBmi);
router.put("/water-glasses", updateWaterGlasses);
router.put("/weekly-stats", updateWeeklyStats);
router.post("/log", logActivity);
router.delete("/log/:logId", deleteActivityLog);
router.delete("/workouts/:workoutId", deleteWorkout);
router.post("/reset-today", resetTodayStats);

export default router;