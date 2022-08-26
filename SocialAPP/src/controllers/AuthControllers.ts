import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt, { JsonWebTokenError } from "jsonwebtoken"
import { db } from "../data/mongoDB"
import { User } from "../interface/UserInterface"
import { encrypt, verifyPass } from "../helpers/passHelper"

const accessSecret:string = process.env.SECRET_ACCESS?? ''
const refreshSecret: string = process.env.SECRET_REFRESH?? ''

export class AuthController{

    private users

    constructor(){
        this.users = db.collection<User>('users')
    }

    public singup = async (req: Request, res: Response) => {
        
        const {email, name, password, confirmpass} = req.body

        const passwordHash = await encrypt(password)
        const ver: number = await verifyPass(password)

        const foundUser = await this.users.findOne<User>({
            email
        })

        if(foundUser){
            return res.status(409).json({error: "Já existe um usuário com este email!"})
        }

        if (ver == 0){
            return res.status(409).send({erro:'Senha incompátivel com nossos critérios'})
        }  

        if(confirmpass != password){
            return res.status(409).json({error: "As senhas devem ser coincidir!"})
        } 

        const refreshToken : string = jwt.sign({email}, refreshSecret, {expiresIn: '30d'})

        const user = {refreshToken , email , name , password: passwordHash}
        
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
            const token = jwt.sign({refreshToken: user.refreshToken}, accessSecret, {expiresIn : '1h'})
        
            res.status(200).json({success: "Autenticação feita com sucesso",user})
        } catch {
            console.log('error')

            res.status(500).json({error: "Erro de servidor"})
        }
    }

    public changepass = async (req: Request, res: Response) => {

        const {email, password} = req.body

        const ver: number = await verifyPass(password)

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
        
    }

    public me = async (req: Request, res: Response) => {
        const auth = req.headers.authorization

        if(!auth){
            return res.status(401).json('Credenciais inválidas!')
        }

        const [authType, authValue] = auth.split(' ')

        const decoded = jwt.decode(authValue)
        
        res.status(200).json({decoded})
    }

}