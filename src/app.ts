import express from "express";
import { configDotenv } from "dotenv";
import authRouter from "./routers/auth-routers";
import uploadRouter from "./routers/upload-routers";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

export const app = express();

app.use(express.json());

app.use(authRouter)
app.use(uploadRouter)