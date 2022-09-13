import { db } from "../data/mongoDB";
import { User } from "../models/userModels";
import { Request, Response } from "express";

export class AuthController{

    private users

    constructor(){
        this.users = db.collection<User>('users')
    }

    public singup = async(req: Request, res: Response) => {
        
        const {name,email,phone,password} = req.body
        
        return res.status(201).send({name,email,phone,password})
    }

    public singin = async(req: Request, res: Response) => {
        
    }
    
    public me = async(req: Request, res: Response) => {
        
    }
}