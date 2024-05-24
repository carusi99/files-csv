import express from "express";
import {
  validateCredentials,
  createUser,
  deleteUsers,
  updateUsers,
} from "../services/auth-services";
import jwt from "jsonwebtoken";
import { validationHandler } from "../middlewares/validation";
import { userSchema } from "../models/auth-models";
import { authenticateHandler } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

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
      console.error("error when registering:", error);
      res
        .status(400)
        .json({
          ok: false,
          error:
            "You are not entering the data correctly, only accept name, email, password, age and role",
        });
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
    console.error("error when entering:", error);
    res
      .status(400)
      .json({
        ok: false,
        error:
          "You are not entering the data correctly, it only accepts email and password",
      });
  }
});

authRouter.delete(
  "/:id",
  authenticateHandler,
  authorize("admin"),
  async (req, res, next) => {
    if (req.userId === undefined) {
      res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    const userId = req.params["id"];
    try {
      const result = await deleteUsers(parseInt(userId, 10)); // Convierte userId a número y llama a deleteUser
      if (!result) {
        res.status(404).json({ ok: false, message: "User not found" });
      }
      res.json({ ok: true, message: "User deleted successfully" });
    } catch (error) {
      next(error); // Pasa cualquier error al siguiente middleware de manejo de errores
    }
  }
);

authRouter.patch(
  "/change/:id",
  authenticateHandler,
  authorize("admin"),
  async (req, res, next) => {
    if (req.userId === undefined) {
      res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    try {
      const userIdToUpdate = parseInt(req.params["id"], 10); // Parsear el id a número
      const userData = req.body; // Usar Partial<User> para permitir campos opcionales

      // Validar los datos del usuario antes de actualizar
      const updateData = {
        ...userData,
        id: userIdToUpdate,
      };

      const profile = await updateUsers(userIdToUpdate, updateData);

      res.json({
        ok: true,
        message: "User updated successfully",
        data: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          age: profile.age,
        },
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(400).json({
        ok: false,
        error: "Bad request: only email, name, or age can be edited",
      });
    }
  }
);

export default authRouter;
