import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {connection} from "./Database/dbConnection.js"
import { errorMiddleware } from "./middleware/error.js";

export const app = express();
config({ path: "./config.env" });

app.use(cors({
    origin: [process.env.FRONTEND_URI],
    methods: ["GET", "POST", "PUT", "DELETE"],
    Credential: true,
}))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(errorMiddleware);

connection();