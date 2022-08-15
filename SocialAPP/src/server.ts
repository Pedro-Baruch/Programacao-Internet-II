import express, {Request, Response} from 'express'
import routes from './routes'

const app = express()

app.use(express.json()) // Permitir arquivos json
app.use(routes) // Utilizar as rotas da pasta routes

// Conferindo express
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({success: 'connected...'})
})

// Config portas
const port: number = 3000

app.listen(port, () => {
    console.log(`Start at http://localhost:${port}`)
})