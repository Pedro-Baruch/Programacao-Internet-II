import { db } from "../data/mongodb";
import { User } from "../repository/userRepository";
import { Request, Response } from "express";
import { decrypt, encrypt } from "../helpers/passHelper";
import { generateToken, refreshVerifyJWT } from "../helpers/tokenHelper";

export class AuthController{
    private users

    constructor(){
        this.users = db.collection('users')
    }

    public singup = async (req: Request, res: Response) => {
        
        const {email, name, password, confirmPassword, telefone} = req.body

        // Verificar se usuário pode criar uma conta
        const foundUser = await this.users.findOne({email})
        
        if(foundUser){
            return res.status(400).send({error: "Email já cadastrado!"})
        }

        if(confirmPassword != password){ // Testar se senhas são iguais
            return res.status(400).send({error: "As senhas devem ser iguais!"})
        }

        // Encriptar senha
        const passwordHash: string = await encrypt(password)

        const refreshToken: string = ""; const refreshIAT: number = 0; const accessToken: string = ""; const accessIAT: number = 0
        const contaAtiva: boolean = false

        const user = {
            email,
            name,
            password: passwordHash,
            telefone,
            contaAtiva,
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
    
        const verifyPassword: boolean = await decrypt(password, user.password)
        if(verifyPassword == false){
            return res.status(400).send({error: "Senha incorreta!"})
        }

        // Gerando access e refresh token e salvando no db
        try {
            const [accessToken, refreshToken]:string[] = await generateToken(user._id, user.email)

            res.status(200).send({msg: "Logado com sucesso!", accessToken: accessToken})
        } catch (error) { 
            return res.status(500).send({error:"erro de servidor"})
        }
    }

    
    public refresh = async (req: Request, res: Response) => {
        
        const auth = req.headers.authorization
        
        if(!auth){
            return res.status(401).send({msg: "Token inválido ou inexistente!"})
        }

        const [type, token] = auth.split(" ")
        const user = await db.collection('users').findOne({refreshToken: token})
        
        if(!user){
            return res.status(401).send({error: "Token inválido!"})
        }
        
        // Verificando token pelo jwt
        const verify:boolean = refreshVerifyJWT(token)
        
        // Verificando a válidade no db
        if(verify == false){
            return res.status(401).send({error: "Token inválido!"})
        }else{            
            const currentDate: number = Math.floor(Date.now() / 1000)
            const valid: number = currentDate - user.refreshIAT
            
            if(valid > 2592000){
                return res.status(401).send({error: "Token inválido!"})
            }
        }
        
        // Gerando um novo par de tokens
        try {
            const [accessToken, refreshToken]:string[] = await generateToken(user._id, user.email)
            
            res.status(200).send({msg: "Tokens renovados", accessToken: accessToken, refreshToken: refreshToken})
        } catch (error) {
            return res.status(500).send({error: "Erro de servidor"})
        }
    }
    
    public me = async (req: Request, res: Response) => {
    
        res.status(200).send({msg: "Deu certo eu acho!"})
    }
}