import jwt,{ JwtPayload } from "jsonwebtoken"
import { db } from "../data/mongoDB"

export const accessSecret:string = process.env.SECRET_ACCESS?? ''
export const refreshSecret: string = process.env.SECRET_REFRESH?? ''

export const createRefreshToken = async (payload: string) => {
    
    const refreshIAT: number = Math.floor(Date.now() / 1000)
    const refreshToken: string = jwt.sign({payload, iat: refreshIAT},refreshSecret,{expiresIn: '30d'})
    
    return [ refreshToken , refreshIAT ]
}

export const createAccessToken = async (payload: string | number ) => {
    
    const accessIAT: number = Math.floor(Date.now() / 1000)
    const accessToken: string = jwt.sign({payload, iat: accessIAT},accessSecret,{expiresIn: '1h'})
    
    return [ accessToken , accessIAT ]
}

export const verifyAccessToken = async (tokenValue: string) => {

    let valid: number = 0 // 0 = Invalid, 1 = Valid

    jwt.verify(tokenValue, accessSecret, function(err,payload){
        if(err){
            valid = 0
        }else{
            valid = 1
        }
    })

    if(!tokenValue){
        console.log("Token ausente")
    }

    const users = db.collection('users')
    const iat = await users.findOne({accessToken: tokenValue})

    if(valid == 1){
        if(iat){
            const atualDate = Math.floor(Date.now() / 1000)
            
            const isValid = atualDate - iat.accessIAT
    
            if(isValid > 3600){
                valid = 0
            }else{
                valid = 1
            }
        }
    }

    return valid
}

export const verifyRefreshToken = async (tokenValue: string, secret: string) => {

}