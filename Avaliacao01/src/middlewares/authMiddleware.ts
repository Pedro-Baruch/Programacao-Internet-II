import { Request, Response, NextFunction } from "express"
import { db } from "../data/mongodb"
import { accessVerifyJWT } from "../helpers/tokenHelper"

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    const auth = req.headers.authorization

    if(!auth){
        return res.status(401).send({msg: "Token inválido ou inexistente!"})
    }

    const [type, token] = auth.split(" ")
    
    if(type == 'Bearer'){
        
        // Verificando token pelo jwt
        let verify: boolean = accessVerifyJWT(token)

        // Verificando a validade no db
        if(verify == false){
            return res.status(401).send({error: "Token inválido!"})
        }else{
            const user = await db.collection('users').findOne({accessToken: token})

            if(!user){
                return res.status(401).send({error: "Token inválido!"})
            }
            
            const currentDate: number = Math.floor(Date.now() / 1000)
            const valid: number = currentDate - user.accessIAT

            if(valid > 3600){
                return res.status(401).send({error: "Token inválido!"})
            }
        }

        next()
    }
}