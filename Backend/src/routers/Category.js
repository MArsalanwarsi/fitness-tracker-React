import express from "express";
import { addCategory, getUserCategory } from "../controllers/CategoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const categoryRouter = express.Router();

categoryRouter.post('/addCategory',authMiddleware,addCategory)
categoryRouter.get('/getUserCategory',authMiddleware,getUserCategory)


export default categoryRouter;