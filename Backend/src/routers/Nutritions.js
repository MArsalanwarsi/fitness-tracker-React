import express from "express";
import {
    // Current-day nutrition
    getNutrition,
    addFoodToMeal,
    updateFoodInMeal,
    deleteFoodFromMeal,
    clearMeal,
    // Daily logs
    getAllLogs,
    getTodayLog,
    getLogById,
    createLog,
    addFoodToLog,
    updateFoodInLog,
    deleteFoodFromLog,
    deleteLog,
    // Analytics
    getTodaySummary,
    getLogsSummary,
} from "../controllers/NutritionsContoller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { aiNutritionSearch } from "../controllers/aiNutritionController.js";

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// -- AI nutrition search (declared BEFORE /:meal to avoid param collision) -----
// POST /api/nutrition/ai-search   body: { query }   returns: { items: [] }
router.post("/ai-search", aiNutritionSearch);

// -- Current-day nutrition (user.nutrition) ------------------------------------
// GET    /api/nutrition                   -> get all meals for today
// POST   /api/nutrition/:meal             -> add food to a meal
// PUT    /api/nutrition/:meal/:foodId     -> update a food item in a meal
// DELETE /api/nutrition/:meal             -> clear all food from a meal
// DELETE /api/nutrition/:meal/:foodId     -> remove a single food item from a meal

router.get("/", getNutrition);
router.get("/summary", getTodaySummary);

router.post("/:meal", addFoodToMeal);
router.put("/:meal/:foodId", updateFoodInMeal);
router.delete("/:meal", clearMeal);
router.delete("/:meal/:foodId", deleteFoodFromMeal);

// -- Daily logs (user.nutritionLogs) -------------------------------------------
// GET    /api/nutrition/logs                          -> all logs (?limit=7 &from= &to=)
// GET    /api/nutrition/logs/today                    -> today's log
// GET    /api/nutrition/logs/summary?days=7           -> chart data
// GET    /api/nutrition/logs/:logId                   -> single log
// POST   /api/nutrition/logs                          -> create log (body: { date? })
// POST   /api/nutrition/logs/:logId/:meal             -> add food to log meal
// PUT    /api/nutrition/logs/:logId/:meal/:foodId     -> update food in log meal
// DELETE /api/nutrition/logs/:logId                   -> delete entire log
// DELETE /api/nutrition/logs/:logId/:meal/:foodId     -> delete food from log meal

router.get("/logs", getAllLogs);
router.get("/logs/today", getTodayLog);
router.get("/logs/summary", getLogsSummary);
router.get("/logs/:logId", getLogById);

router.post("/logs", createLog);
router.post("/logs/:logId/:meal", addFoodToLog);

router.put("/logs/:logId/:meal/:foodId", updateFoodInLog);

router.delete("/logs/:logId", deleteLog);
router.delete("/logs/:logId/:meal/:foodId", deleteFoodFromLog);

export default router;