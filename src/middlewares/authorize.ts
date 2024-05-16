import { NextFunction, Request, Response } from "express";
import { User } from "../models/auth-models";
import { ApiError } from "./error";

export function authorize(...allowedRoles: User["role"][]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const role = req.userRole;
    if (!role) return next(new ApiError("Unauthorized", 401));

    if (allowedRoles.includes(role as User["role"])) {
      next();
    } else {
        console.error('Access denied');
        res.status(500).json({ ok: false, error: 'Access denied is not admin' });
      }
    }
  };

