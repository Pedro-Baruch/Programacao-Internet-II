import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/AuthControllers";
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()
const authController = new AuthController();

router.post('/singup',authController.singup)
router.post('/singin',authController.singin)
router.get('/me', authMiddleware,authController.me)
router.post('/changepass',authController.changepass)
router.post('/refresh',authController.refresh)

export default router