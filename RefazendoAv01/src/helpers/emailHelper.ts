import nodemailer from "nodemailer"
import { db } from "../data/mongoDB"
import { EmailActive } from "../models/emailActivateModel"
import { User } from "../models/userModel"
import { generateCode } from "./generateCodeHelper"

export const sendActivateEmail = async (email: string) => {

    const user: string = process.env.NODEMAILER_USER?? ''
    const pass: string = process.env.NODEMAILER_PASS?? ''

    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: user,
          pass: pass
        }
    })

    const content = saveCode(email)

    transporter.sendMail({
        from: 'Administrator <9ce5ef975a-23d0ce@inbox.mailtrap.io>',
        to: email,
        subject: 'Ativação de conta',
        text: `Código para ativação de conta: ${content}`
    })
}

const saveCode = async(email: string) => {

    const activeEmail = db.collection<EmailActive>('email_active')
    const user = await db.collection<User>('users').findOne({email})

    let code = generateCode()

    const IAT = Math.floor(Date.now() / 1000)

    if(user){
        const active = {
            userEmail: user.email,
            code,
            IAT
        }

        await activeEmail.insertOne(active)
    }

    return code
}