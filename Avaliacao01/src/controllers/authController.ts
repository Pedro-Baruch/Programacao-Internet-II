import { db } from "../data/mongodb";
import { User } from "../repository/userRepository";
import { Request, Response, urlencoded } from "express";
import { decrypt, encrypt } from "../helpers/passHelper";
import { generateToken, refreshVerifyJWT } from "../helpers/tokenHelper";
import { activateAccountEmail, generateCode } from "../helpers/emailHelper";
import { ActivateEmail } from "../repository/activateEmailRepository";
import { generateCodeTelefone } from "../helpers/telefoneHelper";
import { ActivateTelefone } from "../repository/activeTelefone";

export class AuthController{
    private users

    constructor(){
        this.users = db.collection<User>('users')
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
        const passwordHash: string = await encrypt(password)

        const user = {
            email,
            name,
            password: passwordHash,
            telefone: 0,
            contaAtiva: false,
            refreshToken: "",
            refreshIAT: 0,
            accessToken: "",
            accessIAT: 0
        }

        const code = generateCode(email)
        activateAccountEmail(email, code)
        
        // Salvando no banco de dados
        await this.users.insertOne(user)

        return res.status(201).send({msg: "Usuário criado com sucesso!"})
    }

    public ativarEmail = async (req: Request, res: Response) => {
        
        const {email, code} = req.body
        
        const activateEmail = db.collection<ActivateEmail>('ActivateEmail')
        const foundCode = await activateEmail.findOne({userEmail: email})

        if(!foundCode){
            return res.status(404).send({error:'Usuário não foi encontrado'})
        }

        const currentDate = Math.floor(Date.now() / 1000)
        const valid = foundCode.expDate - currentDate

        if(valid > 7200){
            return res.status(400).send({error: 'Código inválido'})
        }

        if(code == foundCode.code){
            const contaAtiva: boolean = true

            const filter = {email}
            const updateDocument = {
                $set: {
                    contaAtiva
                }
            }
            
            await this.users.updateOne(filter,updateDocument)
        }
        
        return res.status(200).send({msg: 'Conta ativada com sucesso!'})
    }
    
    public addTelefone = async (req: Request, res: Response) => {

        const {telefone, email} = req.body

        const user = await this.users.findOne({email})

        if(!user){
            return res.status(404).send({error: "Usuário não registrado!"})
        }

        if(user.telefone == telefone){
            return res.status(400).send({error: "Telefone já registrado"})
        }

        if(user.contaAtiva == false){
            return res.status(400).send({error: "Conta não ativada"})
        }

        const code = generateCodeTelefone(telefone, email)
        console.log('Ativação por sms do número:',telefone,'->',await code)

        return res.status(201).send({msg: "OK :)"})
    }

    public activateTelefone = async (req: Request, res: Response) =>{

        const {telefone, code} = req.body

        const activate = await db.collection<ActivateTelefone>('activateTelefone').findOne({userTelefone: telefone})

        if(!activate){
            return res.status(404).send({error: "Telefone não registrado!"})
        }

        if(activate.code == code){
            const email = activate.userEmail
            
            const filter = {email}
            const updateDocument = {
                $set: {
                    telefone
                }
            }

            await this.users.updateOne(filter,updateDocument)
        }

        return res.status(200).send({msg: "Telefone ativado com sucesso!"})
    }

    public singin = async (req: Request, res: Response) => {
        
        const {email, password} = req.body

        // Verificar se usuário pode logar
        const user = await this.users.findOne({email})

        if(!user){
            return res.status(404).send({error: "Usuário não registrado!"})
        }

        if(user.contaAtiva == false){
            return res.status(400).send({error: "Conta não ativada"})
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
        const user = await this.users.findOne({refreshToken: token})
        
        if(!user){
            return res.status(401).send({error: "Token inválido!"})
        }

        if(user.contaAtiva == false){
            return res.status(400).send({error: "Conta não ativada"})
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