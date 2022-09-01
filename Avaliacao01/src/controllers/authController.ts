import { db } from "../data/mongodb";
import { User } from "../repository/userRepository";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export class AuthController{
    private users

    constructor(){
        this.users = db.collection('users')
    }

    public singup = async (req: Request, res: Response) => {
        
        const {email, name, password, confirmPassword} = req.body

        // Verificar se usuário pode criar uma conta
        const foundUser = await this.users.findOne<User>({email})
        if(foundUser){
            return res.status(400).send({error: "Email já cadastrado!"})
        }

        if(confirmPassword != password){ // Testar se senhas são iguais
            return res.status(400).send({error: "As senhas devem ser iguais!"})
        }

        // Encriptar senha
        const salt: string = await bcrypt.genSalt(12)
        const passwordHash: string = await bcrypt.hash(password, salt)

        const refreshToken: string = ""; const refreshIAT: number = 0; const accessToken: string = ""; const accessIAT: number = 0

        const user = {
            email,
            name,
            password: passwordHash,
            refreshToken,
            refreshIAT,
            accessToken,
            accessIAT
        }

        // Salvando no banco de dados
        await this.users.insertOne(user)

        return res.status(201).send({msg: "Usuário criado com sucesso!"})
    }

    public singin = async (req: Request, res: Response) => {

        const {email, password} = req.body

        // Verificar se usuário pode logar
        const user = await this.users.findOne({email})
        if(!user){
            return res.status(404).send({error: "Usuário não registrado!"})
        }
    
        const verifyPassword = await bcrypt.compare(password, user.password)
        if(verifyPassword == false){
            return res.status(400).send({error: "Senha incorreta!"})
        }

        // Gerando access e refresh token e salvando no db
        const refreshSecret:string = process.env.SECRET_REFRESH?? ''
        const accessSecret:string = process.env.SECRET_ACCESS?? ''

        try {
            const refreshIAT:number = Math.floor(Date.now() / 1000)
            const refreshToken:string = jwt.sign({_id: user._id, iat:refreshIAT}, refreshSecret,{expiresIn: "30d"})

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

            await this.users.updateOne(filter,updateDocument)

            res.status(200).send({msg: "Logado com sucesso!", accessToken: accessToken})
        } catch (error) { 
            return res.status(500).send({error:"erro de servidor"})
        }
    }

    public me = async (req: Request, res: Response) => {

        const auth = req.headers.authorization

        if(!auth){
            return res.status(400).send({msg: "Token inválido ou inexistente!"})
        }

        const [type, token] = auth.split(" ")

        res.status(200).send({msg: "Deu certo eu acho!"})
    }

    public refresh = async (req: Request, res: Response) => {

        const auth = req.headers.authorization

        if(!auth){
            return res.status(400).send({msg: "Token inválido ou inexistente!"})
        }

        const [type, token] = auth.split(" ")
        const user = await db.collection('users').findOne({refreshToken: token})
        
        if(!user){
            return res.status(404).send({error: "Token inválido!"})
        }

        // Verificando token pelo jwt
        const refreshSecret:string = process.env.SECRET_REFRESH?? ''
        let verify:boolean = false

        jwt.verify(token, refreshSecret, function (err, payload){
            if(payload){
                return verify = true
            }
        })

        // Verificando a válidade no db
        if(verify == false){
            return res.status(400).send({error: "Token inválido!"})
        }else{            
            const currentDate = Math.floor(Date.now() / 1000)
            const valid = currentDate - user.refreshIAT

            if(valid > 2592000){
                return res.status(400).send({error: "Token inválido!"})
            }
        }

        // Gerando um novo par de tokens
        const accessSecret:string = process.env.SECRET_ACCESS?? ''

        try {
            const refreshIAT:number = Math.floor(Date.now() / 1000)
            const refreshToken:string = jwt.sign({_id: user._id, iat:refreshIAT}, refreshSecret,{expiresIn: "30d"})

            const accessIAT:number = Math.floor(Date.now() / 1000)
            const accessToken:string = jwt.sign({refreshToken, iat: accessIAT}, accessSecret,{expiresIn: "1h"})

            const filter = {email: user.email}
            const updateDocument = {
                $set: {
                    refreshToken,
                    refreshIAT,
                    accessToken,
                    accessIAT
                }
            }

            await this.users.updateOne(filter,updateDocument)

            res.status(200).send({msg: "Tokens renovados", accessToken: accessToken, refreshToken: refreshToken})
        } catch (error) {
            return res.status(500).send({error: "Erro de servidor"})
        }
    }
}