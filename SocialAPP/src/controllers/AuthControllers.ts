import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { db } from "../data/mongoDB"
import { User } from "../interface/UserInterface"

const accessSecret:string = process.env.SECRET_ACCESS?? ''
const refreshSecret: string = process.env.SECRET_REFRESH?? ''

export class AuthController{

    private users

    constructor(){
        this.users = db.collection<User>('users')
    }

    public singup = async (req: Request, res: Response) => {
        
        const {email, name, password, confirmpass} = req.body

        // Encriptar senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const foundUser = await this.users.findOne<User>({
            email
        })

        // Checando se usuário já existe
        if(foundUser){
            return res.status(409).json({error: "Já existe um usuário com este email!"})
        }

        // Checando se as senhas são iguais
        if(confirmpass != password){
            return res.status(422).json({error: "As senhas devem ser coincidir!"})
        }

        const refreshToken = jwt.sign({}, refreshSecret, {expiresIn: '30d'})

        const user = {refreshToken,email, name, password: passwordHash}
        
        // Salvar no db
        const result = await this.users.insertOne(user)
    
        return res.status(200).json(result)
    }

    public singin = async (req: Request, res: Response) => {
        
        const {email, password} = req.body

        // Checar email
        const user = await this.users.findOne<User>({email})

        if(!user){
            return res.status(422).json({error: "E-mail incorreto ou não registrado"})
        }

        // Checar senha
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            return res.status(422).json({error: "Senha inválida"})
        }

        // Criando token jwt
        try {
            const token = jwt.sign({id: user.id}, accessSecret, {expiresIn : '1h'})

            res.status(200).json({success: "Autenticação feita com sucesso"})
        } catch {
            console.log('error')

            res.status(500).json({
                error: "Erro de servidor"
            })
        }
    }

    public refresh = async (req: Request, res: Response) => {
        const { refreshToken } = req.body

        const token = jwt.sign({ refreshToken }, accessSecret, {expiresIn: '1h'})
        res.status(200).json(token)
    }

    public me = async (req: Request, res: Response) => {
        
        res.status(200).json("Teste de rota")
    }

    public changepass = async (req: Request, res: Response) => {

        const email = req.body.email
        
        res.status(200).json(email)
    }
}