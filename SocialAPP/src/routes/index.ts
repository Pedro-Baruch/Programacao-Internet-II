import { Router } from "express";
import authRouter from "./auth"
import coreRouter from "./core"

const router = Router()

// Rotas do projeto
router.use('/auth', authRouter)
router.use('/core', coreRouter)

export default router