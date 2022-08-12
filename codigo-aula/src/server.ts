import { Request, Response} from "express";
import express from "express"
import authRoutes from "./routes/auth";

const app = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({msg: 'Lets fucking go!!!'})
})

app.use('/auth', authRoutes)

const port:number = 3000
app.listen(port, () => {
    console.log('Start')
})

// Pesquisar sobre SOLID , Desestruturação