import { CelebrateError } from "celebrate";
import { NextFunction, Request, Response } from "express";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const CelebrateAuthMiddleware = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof CelebrateError){
        return res.status(400).send({error: err.details.get('body')?.message})
    }

    return res.status(500).send({type: err.name, message: err.message})
}