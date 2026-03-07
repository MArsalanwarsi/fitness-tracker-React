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

// All routes protected
router.use(authMiddleware);

// GET  /api/dashboard                        → full dashboard data
router.get("/", getDashboard);

// PUT  /api/dashboard/goals                  → update daily goals
router.put("/goals", updateGoals);

// PUT  /api/dashboard/mood                   → update mood
router.put("/mood", updateMood);

// PUT  /api/dashboard/bmi                    → update height/weight
router.put("/bmi", updateBmi);

// PUT  /api/dashboard/water-glasses          → set water glasses count (0-8)
router.put("/water-glasses", updateWaterGlasses);

// PUT  /api/dashboard/weekly-stats           → manual correction of weekly arrays
router.put("/weekly-stats", updateWeeklyStats);

// POST /api/dashboard/log                    → log water/steps/calories/sleep/weight/workout
router.post("/log", logActivity);

// DELETE /api/dashboard/log/:logId           → delete a single activity log entry
router.delete("/log/:logId", deleteActivityLog);

// DELETE /api/dashboard/workouts/:workoutId  → delete a workout
router.delete("/workouts/:workoutId", deleteWorkout);

// POST /api/dashboard/reset-today            → new-day reset (shift weekly arrays, zero macros etc.)
router.post("/reset-today", resetTodayStats);

export default router;

// Register in server.js:
// import dashboardRoutes from "./routes/dashboardRoutes.js";
// app.use("/api/dashboard", dashboardRoutes);