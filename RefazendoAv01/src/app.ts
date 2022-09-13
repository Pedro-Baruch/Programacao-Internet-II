import express from 'express'
import { CelebrateAuthMiddleware } from './auth/authMiddlewares'
import { router } from './routes'

const app = express()

app.use(express.json())
app.use(router)
app.use(CelebrateAuthMiddleware)

const port: number = 3000
app.listen(port,() => {
    console.log(`Rodando no http://localhost:${port}`)
})