import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router() 
const authController = new AuthController()

authRouter.post('/singup',authController.singup) // Registro
authRouter.post('/singin',authController.singin) // Login
authRouter.post('/refresh',authController.refresh) // Renovar tokens
authRouter.post('/activate-email',authController.ativarEmail) // Ativar email
authRouter.post('/add-telefone',authController.addTelefone)
authRouter.post('/activate-telefone',authController.activateTelefone)

authRouter.get('/me',AuthMiddleware,authController.me) // Testar autenticação com middleware

export { authRouter }