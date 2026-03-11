import express from "express";
import { addCategory, getUserCategory, updateCategory, deleteCategory } from "../controllers/CategoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const categoryRouter = express.Router();

categoryRouter.post("/addCategory", authMiddleware, addCategory);
categoryRouter.get("/getUserCategory", authMiddleware, getUserCategory);
categoryRouter.put("/updateCategory/:id", authMiddleware, updateCategory);
categoryRouter.delete("/deleteCategory/:id", authMiddleware, deleteCategory);

export default categoryRouter;