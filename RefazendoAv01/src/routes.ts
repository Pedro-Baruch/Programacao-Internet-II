import { Router } from "express";
import { authRouter } from "./auth/authRoutes";

const router = Router()

router.use('/auth',authRouter)

export { router }