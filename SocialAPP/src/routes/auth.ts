import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/AuthControllers";

const router = Router()
const authController = new AuthController();

router.post('/singup',authController.singup)
router.post('/singin',authController.singin)
router.post('/me', (req: Request, res: Response) => {
    res.status(200).json({msg:'/me'})
})

export default router