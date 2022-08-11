import express, { urlencoded } from "express"
import { userController } from "./controllers/userController"

export const app = express()

// Configurando o link da api
const port = 3000
app.listen(port, () => {
    console.log(`Rodando no --> http://localhost:${port}`)
})

// Chamando os controllers
userController(app)