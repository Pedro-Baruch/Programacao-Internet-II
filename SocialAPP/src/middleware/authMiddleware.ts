import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const auth = req.headers.authorization

    if(!auth){
        return res.status(401).json('Credenciais inválidas!')
    }

    const [authType, authValue] = auth.split(' ')

    // if(authType === 'basic'){

    // }

    if(authType === 'Bearer'){
        
        try {
            const secret: string = "lsdJHLGJH12l234kjh23HGJ123JKH89Jjhg2"

            jwt.verify(authValue, secret)
            
            next()
        } catch (error) {
            res.status(400).json('Token inválido')
        }
    }
}