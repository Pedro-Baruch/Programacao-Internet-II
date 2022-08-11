import express, { urlencoded } from "express"

export const userController = (app) => {
    
    // Configuração para aceitar requisição json
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))

    
}