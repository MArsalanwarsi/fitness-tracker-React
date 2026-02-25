import mongoose from "mongoose";
import "dotenv/config";

const Database = () => mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("Database connected");
}).catch((e) => {
    console.log(e);
});

export default Database;