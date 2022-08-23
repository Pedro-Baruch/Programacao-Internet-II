import { NextFunction, Request, Response } from "express";

export const logMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const method = req.method
    console.log(`LOG ${Date.now()} - ${method} ${req.originalUrl}`)
    return next
}