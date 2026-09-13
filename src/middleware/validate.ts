import type { Request, Response, NextFunction } from "express";
import {z, ZodError} from 'zod';
import { StatusCodes } from "http-status-codes";

export const validateBody = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid input data",
                    error: error.issues
                })
            }
            
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error during validation"
            })
        }
    }
}

