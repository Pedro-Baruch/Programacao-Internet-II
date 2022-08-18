import { Request, Response } from "express"
import { MongoClient } from "mongodb"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

interface User{
    id?: string
    name: string
    email: string
    password: string
}

export class AuthController{

    private client: MongoClient
    private db
    private users

    constructor(){
        const uri = 'mongodb://localhost:27017'
        this.client = new MongoClient(uri)
        this.db = this.client.db('socialapp')
        this.users = this.db.collection<User>('users')
    }

    public singup = async (req: Request, res: Response) => {
        
        const {email, name, password, confirmpass} = req.body

        // Encriptar senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const foundUser = await this.users.findOne<User>({
            email
        })

        if(foundUser){
            return res.status(409).json({error: "Já existe um usuário com este email!"})
        }

        if(confirmpass != password){
            return res.status(422).json({error: "As senhas devem ser coincidir!"})
        }

        const user = {email, name, password: passwordHash}
        
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

        try {
            const secret: string = "lsdJHLGJH12l234kjh23HGJ123JKH89Jjhg2"

            const token = jwt.sign({
                id: user.id
            },
            secret)

            res.status(200).json({success: "Autenticação feita com sucesso", token})
        } catch {
            console.log('error')

            res.status(500).json({
                error: "Erro de servidor"
            })
        }
    }
}