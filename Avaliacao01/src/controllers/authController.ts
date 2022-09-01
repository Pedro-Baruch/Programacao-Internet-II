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

        // Gerando access e refresh token
        const refreshSecret:string = process.env.SECRET_REFRESH?? ''
        const accessSecret:string = process.env.SECRET_ACCESS?? ''

        try {
            const refreshIAT:number = Math.floor(Date.now() / 1000)
            const refreshToken:string = jwt.sign({_id: user._id, iat:refreshIAT}, refreshSecret)

            const accessIAT:number = Math.floor(Date.now() / 1000)
            const accessToken:string = jwt.sign({refreshToken, iat: accessIAT}, accessSecret)

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

            res.status(200).send({msg: "Logado com sucessor", accessToken: accessToken})
        } catch (error) {
            console.log(error)

            return res.status(500).send({error:"erro de servidor"})
        }
    }

    public me = async (req: Request, res: Response) => {

        
    }
}