import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { db } from "../data/mongoDB"
import { User } from "../interface/UserInterface";
import bcrypt from "bcrypt"

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
                return res.status(400).json('Token inválido')
            }
        }else{
            return res.status(400).json('Token inválido')
        }

        return next()
    }

    if(authType === 'Bearer'){
        try {
            const secret: string = "lsdJHLGJH12l234kjh23HGJ123JKH89Jjhg2"

            const verify = jwt.verify(authValue, secret)

            next()
        } catch (error) {
            res.status(400).json('Token inválido')
        }
    }
}