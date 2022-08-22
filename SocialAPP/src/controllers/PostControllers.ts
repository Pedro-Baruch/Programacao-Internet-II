import { db } from "../data/mongoDB"
import { Request, Response } from "express"
import { Post } from "../interface/PostInterface"

export class PostController{

    private posts

    constructor(){
        this.posts = db.collection<Post>('posts')
    }

    public addPosts = async (req: Request, res: Response) => {
        const text = req.body.text

        const post =  {text, likes: 0, date: new Date()}

        const result = await this.posts.insertOne(post)

        return res.status(201).json(result)
    }

    public listPosts = async (req: Request, res: Response) => {

        const list = this.posts.find({})

        return res.status(201).json(list)
    }

    public deletePosts = async (req: Request, res: Response) => {
        return res.status(201).json('delete')
    }  

    public editPosts = async (req: Request, res: Response) => {
        return res.status(201).json('edit')
    }
}