import { db } from "../data/mongoDB"
import { Request, Response } from "express"

interface Post{
    id?: string
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

        const post =  {text, likes: 0, date: new Date()}

        return res.status(201).json()
    }

    public listPosts = async (req: Request, res: Response) => {
        return res.status(201).json('List')
    }

    public deletePosts = async (req: Request, res: Response) => {
        return res.status(201).json('delete')
    }  

    public editPosts = async (req: Request, res: Response) => {
        return res.status(201).json('edit')
    }
}