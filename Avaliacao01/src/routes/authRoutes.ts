import { Router } from "express";
import { AuthController } from "../controllers/authController";

const authRouter = Router() 
const authController = new AuthController()

authRouter.post('/singup',authController.singup) // Registro
authRouter.post('/singin',authController.singin) // Login
authRouter.get('/me',authController.me) // Testar autenticação com middleware

export { authRouter }