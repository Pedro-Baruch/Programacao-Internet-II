import { Router } from "express";
import { PostController } from "../controllers/PostControllers";
import { authMiddleware } from "../middleware/authMiddleware"

const postRoutes = Router()
const postController = new PostController()

postRoutes.use(authMiddleware)

postRoutes.post('/add',postController.addPosts)
postRoutes.get('/list',postController.listPosts)
postRoutes.delete('/delete',postController.deletePosts)
postRoutes.put('/edit',postController.editPosts)

export { postRoutes }