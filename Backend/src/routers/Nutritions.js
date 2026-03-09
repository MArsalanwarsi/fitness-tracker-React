import express from "express";
import {
    getNutrition,
    addFoodToMeal,
    updateFoodInMeal,
    deleteFoodFromMeal,
    clearMeal,
    getAllLogs,
    getTodayLog,
    getLogById,
    createLog,
    addFoodToLog,
    updateFoodInLog,
    deleteFoodFromLog,
    deleteLog,
    getTodaySummary,
    getLogsSummary,
} from "../controllers/NutritionsContoller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { aiNutritionSearch } from "../controllers/aiNutritionController.js";

const router = express.Router();
router.use(authMiddleware);
router.post("/ai-search", aiNutritionSearch);
router.get("/", getNutrition);
router.get("/summary", getTodaySummary);

router.post("/:meal", addFoodToMeal);
router.put("/:meal/:foodId", updateFoodInMeal);
router.delete("/:meal", clearMeal);
router.delete("/:meal/:foodId", deleteFoodFromMeal);
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