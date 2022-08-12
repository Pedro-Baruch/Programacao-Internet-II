import { Request, Response } from "express"
import { MongoClient } from 'mongodb'

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

    public signup = async (req: Request, res: Response) => {

        const {email, name, password} = req.body

        const user = {email, name, password}

        const foundUser = await this.users.findOne<User>({
            email
        })

        if (foundUser){
            return res.status(409).json({error: "Já existe um usuário com este email!"})
        }
    
        // save into db
        const result = await this.users.insertOne(user)
    
        return res.status(200).json(result)
    }

    public signin = async (req: Request, res: Response) => {
        const {email, password} = req.body


        const foundUser = await this.users.findOne<User>({
            email, password
        })

        if (!foundUser){
            return res.status(401).json({error: "Usuário e/ou senha incorretos!"})
        } 

        return res.json(foundUser)
    }
}