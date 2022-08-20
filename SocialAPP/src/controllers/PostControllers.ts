import { db } from "../data/mongoDB"
import { Request, Response } from "express"

interface Post{
    id?: string
    user_email: string
    text: string
    likes: number
    date: Date
}

export class PostController{

    private posts

    constructor(){
        this.posts = db.collection<Post>('posts')
    }

    public addPosts = async (req: Request, res: Response) => {
        const text = req.body.text

        return res.status(201)
    }

    public listPosts = async (req: Request, res: Response) => {
        
    }

    public deletePosts = async (req: Request, res: Response) => {
        
    }

    public editPosts = async (req: Request, res: Response) => {
        
    }
}