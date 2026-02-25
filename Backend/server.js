import express from "express";
import cors from "cors"
import authRouter from "./src/routers/Auth.js";
import "dotenv/config"
import Database from "./src/config/dbConnection.js";

const app =express();
const port = process.env.PORT || 1000;
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

Database();

app.listen(port,()=>{
    console.log(`Server Listen: http://localhost:${port}`)
})
