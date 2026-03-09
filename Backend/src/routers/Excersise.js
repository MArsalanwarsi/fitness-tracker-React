import express from "express";
import { AddExcersise, deleteExcersise, getUserExcersises, updateExcersise } from "../controllers/ExcersiseController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const excersiseRouter = express.Router();

excersiseRouter.post('/addExcersise', authMiddleware, AddExcersise)
excersiseRouter.get('/getUserExcersises', authMiddleware, getUserExcersises)
excersiseRouter.delete('/deleteExcersise/:id', authMiddleware, deleteExcersise)
excersiseRouter.put('/updateExcersise/:id', authMiddleware, updateExcersise)

export default excersiseRouter;