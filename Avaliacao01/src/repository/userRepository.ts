export interface User{
    id?: string
    email: string
    name: string
    password: string
    telefone: number
    contaAtiva: boolean
    accessToken: string
    accessIAT: number
    refreshToken: string
    refreshIAT: number
}