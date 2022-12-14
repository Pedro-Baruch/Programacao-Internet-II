import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { db } from "../data/mongoDB"
import { User } from "../interface/UserInterface";
import { accessSecret, verifyAccessToken } from "../helpers/tokenHelper"
import { jwtVerify } from "jose";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const auth = req.headers.authorization

    if(!auth){
        return res.status(401).json('Credenciais inválidas!')
    }

    const [authType, authValue] = auth.split(' ')

    if(authType === 'Basic'){
        let buff = Buffer.from(authValue, 'base64');
        let [email, password] = buff.toString('ascii').split(':');
        
        const users = db.collection<User>('users')
        const user = await users.findOne<User>({email})

        if(user){
            const checkPassword = await bcrypt.compare(password, user.password)
            
            if(!checkPassword){
                return res.status(401).json('Senha inválida')
            }
        }else{
            return res.status(401).json('Email inválido')
        }
    }

    if(authType === 'Bearer'){
        const valid: number = await verifyAccessToken(authValue)

        if(valid == 0){
            return res.status(401).send({error: "Token inválido"}) 
        }
    }

    return next()
}