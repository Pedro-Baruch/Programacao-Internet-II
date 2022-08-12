import { Request,Response,Router } from "express"

const router = Router()

const feed = 'feed'

router.get('/feed', (req: Request,res: Response) => {
    res.json({feed})
})

export default router