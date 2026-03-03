import express from "express";
import { AddExcersise } from "../controllers/ExcersiseController.js";
import  authMiddleware  from "../middleware/authMiddleware.js";

const excersiseRouter = express.Router();

excersiseRouter.post('/addExcersise',authMiddleware, AddExcersise)

export default excersiseRouter;