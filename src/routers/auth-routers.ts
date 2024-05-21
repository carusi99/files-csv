
import express from "express";
import { validateCredentials, createUser } from "../services/auth-services";
import jwt from "jsonwebtoken";
import {validationHandler} from "../middlewares/validation";
import { userSchema } from "../models/auth-models";

const jwtSecret = "ultra-mega-secret";
const authRouter = express.Router();

authRouter.post(
  "/signup",
  validationHandler(userSchema), // Validar los datos antes de crear el usuario
  async (req, res, next) => {
    try {
      const newUser = await createUser(req.body); // Crear el usuario
      res.status(201).json({
        ok: true,
        message: "User created successfully", 
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error('error when registering:', error);
      res.status(400).json({ ok: false, error: 'You are not entering the data correctly, only accept name, email, password, age and role' });
    }
  }
);


authRouter.post("/login", async (req, res, next) => {
    try {
      const user = await validateCredentials(req.body); // Validar las credenciales del usuario
      const payload = { userId: user.id, userRole: user.role }; // Crear el payload para el token JWT 
      const token = jwt.sign(payload, jwtSecret, { expiresIn: "60m" }); // Crear el token JWT
      res.json({
        ok: true,
        message: "User logged in successfully",
        data: { token: token },
      });
    } catch (error) {
      console.error('error when entering:', error);
      res.status(400).json({ ok: false, error: 'You are not entering the data correctly, it only accepts email and password' });
    }
  });
  
  export default authRouter;