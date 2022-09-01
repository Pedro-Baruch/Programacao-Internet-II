import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { db } from "../data/mongodb"

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    const auth = req.headers.authorization

    if(!auth){
        return res.status(400).send({msg: "Token inválido ou inexistente!"})
    }

    const [type, token] = auth.split(" ")
    
    if(type == 'Bearer'){
        
        // Verificando token pelo jwt
        const accessSecret:string = process.env.SECRET_ACCESS?? ''
        let verify: boolean = false

        jwt.verify(token, accessSecret, function (err, payload){
            if(payload){
                return verify = true
            }
        })

        // Verificando a validade no db
        if(verify == false){
            return res.status(400).send({error: "Token inválido!"})
        }else{
            const user = await db.collection('users').findOne({accessToken: token})

            if(!user){
                return res.status(404).send({error: "Token inválido!"})
            }
            
            const currentDate = Math.floor(Date.now() / 1000)
            const valid = currentDate - user.accessIAT

            if(valid > 3600){
                return res.status(400).send({error: "Token expirado!"})
            }
        }

        next()
    }
}