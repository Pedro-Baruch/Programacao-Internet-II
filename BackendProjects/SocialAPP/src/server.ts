import express, {Request, Response} from 'express'
import routes from './routes'
import * as dotenv from 'dotenv';

const app = express()
dotenv.config();

app.use(express.json()) // Permitir arquivos json
app.use(routes) // Utilizar as rotas da pasta routes

// Conferindo express
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({success: 'connected...'})
})

// Config portas
const port: number = 3000
app.listen(port, () => {
    console.log(`Application running on: http://localhost:${port}`)
})