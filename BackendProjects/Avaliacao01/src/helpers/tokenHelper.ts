import jwt from "jsonwebtoken"
import { db } from "../data/mongodb"

const refreshSecret:string = process.env.SECRET_REFRESH?? ''
const accessSecret:string = process.env.SECRET_ACCESS?? ''

export const generateToken = async (id: object, email: string) => {
    
    const refreshIAT:number = Math.floor(Date.now() / 1000)
    const refreshToken:string = jwt.sign({_id: id,iat:refreshIAT}, refreshSecret,{expiresIn: "30d"})

    const accessIAT:number = Math.floor(Date.now() / 1000)
    const accessToken:string = jwt.sign({refreshToken, iat: accessIAT}, accessSecret,{expiresIn: "1h"})

    const filter = {email}
    const updateDocument = {
        $set: {
            refreshToken,
            refreshIAT,
            accessToken,
            accessIAT
        }
    }

    await db.collection('users').updateOne(filter,updateDocument)

    return [accessToken, refreshToken]
}

export const accessVerifyJWT = (token: string) => {
    let verify: boolean = false

    jwt.verify(token, accessSecret, function (err, payload){
        if(payload){
            return verify = true
        }
    })

    return verify
}

export const refreshVerifyJWT = (token: string) => {
    let verify: boolean = false

    jwt.verify(token, refreshSecret, function (err, payload){
        if(payload){
            return verify = true
        }
    })

    return verify
} 