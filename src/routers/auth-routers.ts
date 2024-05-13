import express from "express";
import { validateCredentials } from "../services/auth-services";
import jwt from "jsonwebtoken";
const authRouter = express.Router();

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