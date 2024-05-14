import express from "express";
import { configDotenv } from "dotenv";
import userRouter from "./routers/auth-routers";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

export const app = express();

app.use(express.json());
app.use(userRouter)