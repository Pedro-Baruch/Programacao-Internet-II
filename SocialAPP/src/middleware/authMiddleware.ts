import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken"
import { db } from "../data/mongoDB"
import { User } from "../interface/UserInterface";
import bcrypt from "bcrypt"
import { SECRET_ACCESS } from "../controllers/AuthControllers";

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
        try {
            const verify = jwt.verify(authValue, SECRET_ACCESS)
            console.log(verify)
        } catch (error) {
            return res.status(401).send("Token inválido")
        }
    }

    return next()
}