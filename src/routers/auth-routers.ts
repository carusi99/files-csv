
import express from "express";
import { validateCredentials, createUser } from "../services/auth-services";
import jwt from "jsonwebtoken";
import {validationHandler} from "../middlewares/validation";
import { userSchema } from "../models/auth-models";

const jwtSecret = "ultra-mega-secret";
const authRouter = express.Router();

authRouter.post(
  "/signup",
  validationHandler(userSchema),
  async (req, res, next) => {
    try {
      const newUser = await createUser(req.body);
      res.status(201).json({
        ok: true,
        message: "Usuario registrado exitosamente",
        data: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);


authRouter.post("/login", async (req, res, next) => {
    try {
      const user = await validateCredentials(req.body);
      const payload = { userId: user.id, userRole: user.role };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: "60m" });
      res.json({
        ok: true,
        message: "Login exitoso",
        data: { token: token },
      });
    } catch (error) {
      next(error);
    }
  });
  
  export default authRouter;