import express from "express";
import { AddExcersise } from "../controllers/ExcersiseController.js";

const excersiseRouter = express.Router();

excersiseRouter.post('/addExcersise', AddExcersise)

export default excersiseRouter;