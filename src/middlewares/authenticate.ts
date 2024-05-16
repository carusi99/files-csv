import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "./error";

// Extendemos el objeto Request para incluir la propiedad user
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: string;
    }
  }
}

export const jwtSecret = "ultra-mega-secret";

export function authenticateHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("Middleware authenticateHandler reached");

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("Token not found in headers");
    return next(new ApiError("Unauthorized", 401));
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as {
      userId: number;
      userRole: string;
      iat: number;
      exp: number;
    };

    req.userId = payload.userId; // Asignar el ID de usuario extraído del token a req.userId
    req.userRole = payload.userRole;
    next();
  } catch (error: any) {
    console.log("Error when verifying token:", error.message);
    const errorMessage = "Unauthorized";
    res.status(401).json({ ok: false, data: errorMessage });
  }
}
