import { Router } from "express";
import { PostController } from "../controllers/PostControllers";
import { authMiddleware } from "../middleware/authMiddleware"

const postRoutes = Router()
const postController = new PostController()

postRoutes.use(authMiddleware)

postRoutes.post('/create',postController.create)

export { postRoutes }