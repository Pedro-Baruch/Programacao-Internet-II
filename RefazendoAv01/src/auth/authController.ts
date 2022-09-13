import { db } from "../data/mongoDB";
import { User } from "../models/userModel";
import { Request, Response } from "express";
import { encrypt } from "../authHelpers/encryptHelper";
import { sendActivateEmail } from "../authHelpers/emailHelper";
import { sendActivatePhone } from "../authHelpers/phonehelper";
import { EmailActive } from "../models/emailActivateModel";

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
            phone:'+0000000000000',
            password: passwordHash,
            emailActive: false,
            phoneActive: false
        }

        const result = await this.users.insertOne(user)
        
        try {
            sendActivateEmail(user.email)
        } catch (error) {
            return res.status(400).send({err: 'Não foi possivel enviar o email.'})
        }

        return res.status(201).send({msg: result.acknowledged, success: 'Registrado com sucesso!'})
    }

    public validateEmail = async(req: Request, res: Response) => {

        const {email, code} = req.body

        const activate = await db.collection<EmailActive>('email_active').findOne({userEmail: email})
        const user = await this.users.findOne({email})

        if(user?.emailActive == true){
            return res.status(200).send({msg: 'Email já foi ativado'})
        }

        if(activate){
            if(code == activate.code){
                
                const currenteDate = Math.floor(Date.now() / 1000)

                if(currenteDate - activate.IAT < 3600){
                   
                    const filter = {email}
                    const updateDocument = {
                        $set: {
                            emailActive: true
                        }
                    }

                    this.users.updateOne(filter,updateDocument)

                    return res.status(200).send({msg: 'Email ativado com sucesso!'})
                }
            }
        }

        return res.status(404).send({err: 'Não foi possivel localizar o email!'})
    }

    public refreshEmailCode = async(req: Request, res: Response) => {
        
        const {email} = req.body

        const activate = await db.collection<EmailActive>('email_active').findOne({userEmail: email})

        if(!activate){
            return res.status(404).send({err: 'Não foi possivel encontrar usuário.'})
        }

        try {
            sendActivateEmail(email)
            return res.status(200).send({msg: 'Código foi renovado!'})
        } catch (error) {
            return res.status(400).send({err: 'Não foi possivel reenviar o código.'})
        }
    }

    public singin = async(req: Request, res: Response) => {
        
    }
    
    public me = async(req: Request, res: Response) => {
        
    }
}