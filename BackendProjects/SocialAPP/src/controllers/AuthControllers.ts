import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { db } from "../data/mongoDB"
import { User } from "../interface/UserInterface"
import { encrypt, validPass } from "../helpers/passHelper"
import { accessSecret, createAccessToken, createRefreshToken } from "../helpers/tokenHelper"
import { refreshSecret } from "../helpers/tokenHelper"
import { consumers } from "stream"

export class AuthController{

    private users

    constructor(){
        this.users = db.collection<User>('users')
    }

    public singup = async (req: Request, res: Response) => {
        
        const {email, name, password, confirmpass} = req.body

        const passwordHash = await encrypt(password)
        const ver: number = await validPass(password)

        const foundUser = await this.users.findOne<User>({email})

        if(foundUser){
            return res.status(409).json({error: "Já existe um usuário com este email!"})
        }

        if (ver == 0){
            return res.status(409).send({erro:'Senha incompátivel com nossos critérios'})
        }  

        if(confirmpass != password){
            return res.status(409).json({error: "As senhas devem ser coincidir!"})
        } 

        const [refreshToken, refreshIAT] = await createRefreshToken(email)
        const [accessToken, accessIAT] = await createAccessToken(refreshToken)

        const user = {
            email,
            name,
            password: passwordHash,
            refreshToken,
            refreshIAT,
            accessToken,
            accessIAT
        }
        
        const result = await this.users.insertOne(user)
    
        return res.status(200).json(result)
    }

    public singin = async (req: Request, res: Response) => {
        
        const {email, password} = req.body

        const user = await this.users.findOne<User>({email})

        if(!user){
            return res.status(422).json({error: "E-mail incorreto ou não registrado"})
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            return res.status(422).json({error: "Senha inválida"})
        }

        try {
            const [refreshToken, refreshIAT] = await createRefreshToken(email)
            const [accessToken, accessIAT] = await createAccessToken(refreshToken)
        
            const filter = { email: email }
            const updateDocument = {
                $set: {
                    refreshToken,
                    refreshIAT,
                    accessToken,
                    accessIAT
                }
            }

            this.users.updateOne(filter,updateDocument)

            const result = await this.users.findOne({email: email})

            res.status(200).json({success: "Autenticação feita com sucesso",result})
        } catch {
            console.log('error')

            res.status(500).json({error: "Erro de servidor"})
        }
    }

    public changepass = async (req: Request, res: Response) => {

        const {email, password} = req.body

        const ver: number = await validPass(password)

        if (ver == 0){
            res.status(400).send('Senha incompátivel com nossos critérios')
        }   
        
        const passwordHash = await encrypt(password)

        const filter = { email: email}
        const updateDocument = {
            $set: {
                password: passwordHash
            }
        }

        this.users.updateOne(filter,updateDocument)

        res.status(201).send("Senha alterada com sucesso")
    }

    public refresh = async (req: Request, res: Response) => {
        
        const auth = req.headers.authorization

        if(!auth){
            return res.status(401).json({error: 'Credenciais inválidas!'})
        }

        const [tokenType, tokenValue] = auth.split(' ')

        const user = await this.users.findOne({refreshToken: tokenValue})

        if(!user){
            return res.status(409).json({error: "Não existe um usuário relacionado a essa token!"})
        }

        const email = user.email

        try {
            const [refreshToken, refreshIAT] = await createRefreshToken(email)
            const [accessToken, accessIAT] = await createAccessToken(refreshToken)
    
            const filter = { email: email }
                 const updateDocument = {
                     $set: {
                        refreshToken,
                        refreshIAT,
                        accessToken,
                        accessIAT
                    }
            }
            
            this.users.updateOne(filter,updateDocument)
    
            const result = await this.users.findOne({email})

            return res.status(200).json({result})
        } catch (error) {
            console.log('error')

            return res.status(500).json({error: "Erro de servidor"})
        }
    }

    public me = async (req: Request, res: Response) => {
        const auth = req.headers.authorization

        if(!auth){
            return res.status(401).json({error: 'Sem credenciais!'})
        }

        const [authType, authValue] = auth.split(' ')

        const decoded = jwt.decode(authValue)
        
        res.status(200).json({decoded})
    }

}