import express from 'express'
import { router } from './routes'

const app = express()

app.use(express.json()) // Fazer o express aceitar requisições JSON
app.use(router) // Utilizaar as rotas da pasta "routes"

// Configurando a porta da aplicação
const port: number = 3000
app.listen(port,() => {
    console.log(`Rodando no http://localhost:${port}`)
})