import jwt,{ JwtPayload } from "jsonwebtoken"

export const accessSecret:string = process.env.SECRET_ACCESS?? ''
export const refreshSecret: string = process.env.SECRET_REFRESH?? ''

export const createRefreshToken = async (payload: JwtPayload) => {
    
    const refreshIAT: number = Math.floor(Date.now() / 1000)
    const refreshToken: string = jwt.sign({payload, iat: refreshIAT},refreshSecret,{expiresIn: '30d'})
    
    return [ refreshToken , refreshIAT ]
}

export const createAccessToken = async (payload: string | number ) => {
    
    const accessIAT: number = Math.floor(Date.now() / 1000)
    const accessToken: string = jwt.sign({payload, iat: accessIAT},accessSecret,{expiresIn: '1h'})
    
    return [ accessToken , accessIAT ]
}