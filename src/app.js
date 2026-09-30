import express from "express";
import morgan from "morgan";
import authRouter from "./router/auth.router.js";
import jwt from "jsonwebtoken";
import cookieparser from 'cookie-parser';
import crypto from "crypto";
import uploadrouter from "./router/resume.router.js"

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieparser()),
app.use("/uploads", express.static("uploads"));
app.use("/api/resume", uploadrouter);


app.use("/api/auth", authRouter);



export default app;