import { Request,Response,Router } from "express";
import { AuthController } from '../controllers/AuthController';

const router = Router()

const authController = new AuthController();

router.post('/singup', (req: Request, res: Response) => {
    res.status(200).json({msg: "Deu certo!!!"})
})

router.post('/singin', (req: Request, res: Response) => {
    res.status(200).json({msg: "Deu certo!!!"})
})

router.post('/me', (req: Request, res: Response) => {
    res.status(200).json({msg: "Deu certo!!!"})
})

export default router