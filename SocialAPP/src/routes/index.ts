import { Router } from "express";
import authRouter from "./auth"
import coreRouter from "./core"
import { postRoutes } from "./post";

const router = Router()

// Rotas do projeto
router.use('/auth', authRouter)
router.use('/core', coreRouter)
router.use('/post', postRoutes)

export default router