import { ZodSchema} from "zod";
import { NextFunction, Request, Response } from "express";

export function validationHandler<T>(schema: ZodSchema<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = schema.parse(req.body);
      req.body = body;
      next();
    } catch (error) {
      console.error('Error when validating', error);
      res.status(500).json({ ok: false, error: 'Error when validating' });
    }
  };
}