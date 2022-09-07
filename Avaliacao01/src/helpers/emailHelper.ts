import nodemailer from "nodemailer"
import { db } from "../data/mongodb"
import { ActivateEmail } from "../repository/activateEmailRepository"

export const sendActivateEmail = async (email: string, content: Promise<number>) => {

    const user: string = process.env.nodemailerUser?? ''
    const pass: string = process.env.nodemailerPass?? ''

    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: user,
          pass: pass
        }
    })

    transporter.sendMail({
        from: 'Administrator <9ce5ef975a-23d0ce@inbox.mailtrap.io>',
        to: email,
        subject: 'Ativação de conta',
        text: `Código para ativação de conta: ${await content}`
    })
}

export const createCodeEmail = async (email: string) => {

    const activateEmail = db.collection<ActivateEmail>('ActivateEmail')
    let code: number = await generateCode()

    const currentDate = Math.floor(Date.now() / 1000)
    const iatDate: number = currentDate
    
    const activate = {
        userEmail: email,
        code,
        iatDate
    }

    await activateEmail.insertOne(activate)

    return code
}

export const refreshCode = async (email: string) => {
    
    const activateEmail = db.collection<ActivateEmail>('ActivateEmail')
    let code: number = await generateCode()

    const currentDate = Math.floor(Date.now() / 1000)
    const iatDate: number = currentDate

    const filter = {userEmail: email}
    const updateDocument = {
        $set: {
            userEmail: email,
            code,
            iatDate
        }
    }

    await activateEmail.updateOne(filter,updateDocument)
}

const generateCode = async () => {
    
    let code: number = generateNum()

    for(code;code <= 9999; code = generateNum()){} // verifica se codigo é maior que 4 digitos

    return code
}

const generateNum = () => {
    return Math.floor(Math.random() * 65536)
}