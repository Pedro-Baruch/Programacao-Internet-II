export interface User{
    id?: string
    name: string
    email: string
    password: string
    refreshToken: string | number
    refreshIAT: string | number
    accessToken: string | number
    accessIAT: string | number
}