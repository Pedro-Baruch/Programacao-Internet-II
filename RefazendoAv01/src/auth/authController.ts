import { db } from "../data/mongoDB";
import { User } from "../models/userModel";
import { Request, Response } from "express";
import { encrypt } from "../authHelpers/encryptHelper";
import { sendActivateEmail } from "../authHelpers/emailHelper";
import { sendActivatePhone } from "../authHelpers/phonehelper";

export class AuthController{

    private users

    constructor(){
        this.users = db.collection<User>('users')
    }

    public singup = async(req: Request, res: Response) => {
        
        const {name,email,phone,password} = req.body
        
        const foundUser = await this.users.findOne({email})

        if(foundUser?.emailActive == true){
            return res.status(400).send({err: 'Email já registrado e ativado'})
        }

        const passwordHash = await encrypt(password)
        
        const user = {
            name,
            email,
            phone,
            password: passwordHash,
            emailActive: false,
            phoneActive: false
        }

        const result = await this.users.insertOne(user)
        sendActivateEmail(user.email)

        return res.status(201).send({msg: result.acknowledged, success: 'Registrado com sucesso!'})
    }

    public singin = async(req: Request, res: Response) => {
        
    }
    
    public me = async(req: Request, res: Response) => {
        
    }
}