import { db } from "../data/mongoDB"
import { Request, Response } from "express"

interface Post{
    id?: string
    text: string
    likes: number
}

export class PostController{

    private posts

    constructor(){
        this.posts = db.collection<Post>('posts')
    }

    public create = async (req: Request, res: Response) => {
        const body = req.body
        return res.status(201).json(body)
    }
}