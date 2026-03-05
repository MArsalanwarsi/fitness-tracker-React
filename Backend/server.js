import express from "express";
import cors from "cors"
import authRouter from "./src/routers/Auth.js";
import "dotenv/config"
import Database from "./src/config/dbConnection.js";
import excersiseRouter from "./src/routers/Excersise.js";
import categoryRouter from "./src/routers/Category.js";

const app =express();
const port = process.env.PORT || 1000;
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/exercise', excersiseRouter);
app.use('/category',categoryRouter)

Database();

app.listen(port,()=>{
    console.log(`Server Listen: http://localhost:${port}`)
})
