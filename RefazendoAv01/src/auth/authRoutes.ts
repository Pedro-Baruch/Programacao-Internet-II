import { celebrate } from "celebrate";
import { Router } from "express";
import { AuthController } from "./authController";
import { schema } from "./services/celebrateService";

const authRouter = Router()
const authController = new AuthController()

authRouter.post('/singup',schema,authController.singup)
authRouter.post('/singin', authController.singin)
authRouter.get('/me', authController.me)

export { authRouter }