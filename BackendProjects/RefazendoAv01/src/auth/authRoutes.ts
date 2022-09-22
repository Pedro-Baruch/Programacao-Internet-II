import { Router } from "express";
import { AuthController } from "./authController";
import { refreshEmailSchema, registerSchema, validateEmailSchema } from "../authHelpers/celebrateHelper";

const authRouter = Router()
const authController = new AuthController()

authRouter.post('/singup',registerSchema,authController.singup)
authRouter.post('/validate/email',validateEmailSchema,authController.validateEmail)
authRouter.post('/refresh/email',refreshEmailSchema,authController.refreshEmailCode)
authRouter.post('/singin', authController.singin)
authRouter.get('/me', authController.me)

export { authRouter }