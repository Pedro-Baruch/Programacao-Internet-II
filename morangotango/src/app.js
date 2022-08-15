// Imports
require('dotenv').config()
const express = require('express')
const mogoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')

const app = express()

// Config para ler json
app.use(express.json())

// Models
const User = require('./models/UserRepository')

// Rota publica
app.get('/', (req, res) => {
    res.status(200).json({msg: 'Hello World!!!'})
})

// Regitro
app.post('/auth/registro', async(req, res) => {
    const {name, email, password, confirmpassword} = req.body

    // Validação
    if(!name){
        return res.status(422).json({msg: 'O nome é obrigatório'})
    }

    if(!email){
        return res.status(422).json({msg: 'O email é obrigatório'})
    }

    if(!password){
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }

    if(password !== confirmpassword){
        return res.status(422).json({msg: 'As senhas são diferentes!'})
    }

    // Pesquisar se usuário já existe
    const userExists = await User.findOne({email: email})

    if(userExists){
        return res.status(422).json({msg: 'E-mail já utilizado'})
    }

    // Criando a senha password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Criando o usuário
    const user = new User({
        name,
        email,
        password: passwordHash,
    })
    try{
        await user.save()
        res.status(201).json({msg: 'Usuário criado com sucesso'})
    }catch(error){
        res.status().json({msg: 'Erro'})
    }
})

// Login user
app.post("/auth/login", async (req, res) => {
    
    const {email, password} = req.body

    // Validação 
    if(!email) {
        return res.status(422).json({msg: 'O email é obrigatório'})
    }

    if(!password){
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }

    // Pequisar se o usuário existe
    const user = await User.findOne({email: email})

    if(!user){
        return res.status(404).json({msg: 'E-mail não registrado'})
    }

    // Verificar se a senha é igual
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword){
        return res.status(422).json({msg: 'Senha inválida!'})
    }

    try {
        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id
        },
        secret,
        )

        res.status(200).json({msg: "Autenticação feita com sucesso", token})
    } catch(err){
        res.status().json({msg: 'Erro'})
    }
})

// Credenciais
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose
.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.p5dgobc.mongodb.net/?retryWrites=true&w=majority`)
.then(() => {
    app.listen(3000)
    console.log('Conectado ao MongoDB!')
})
.catch((err) => console.log(err))