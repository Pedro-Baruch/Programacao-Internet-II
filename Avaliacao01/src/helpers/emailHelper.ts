import nodemailer from "nodemailer"
import { db } from "../data/mongodb"
import { ActivateEmail } from "../repository/activateRepository"

export const activateAccountEmail = async (email: string, content: Promise<number>) => {

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

export const generateCode = async (email: string) => {

    const activateEmail = db.collection<ActivateEmail>('ActivateEmail')
    
    let code: number = generateNum()
    for(code;code <= 9999; code = generateNum()){} // verifica se codigo é maior que 4 digitos

    const foundCode = await activateEmail.findOne({code})
    
    if(foundCode){ // verifica se existe com código igual no db
        for(code; code == foundCode.code; code = generateNum()){} 
    }

    const currentDate = Math.floor(Date.now() / 1000)
    const expDate = currentDate + 7200
    
    const activate = {
        userEmail: email,
        code,
        expDate
    }

    await activateEmail.insertOne(activate)

    return code
}

const generateNum = () => {
    return Math.floor(Math.random() * 65536)
}

// export const generateCode = async () => {
    
//     const secret: string = process.env.SECRET?? ''

//     generateKeyPair('rsa', {
//         modulusLength: 4096,
//         publicKeyEncoding: {
//             type: 'spki',
//             format: 'pem'
//         },
//         privateKeyEncoding: {
//             type: 'pkcs8',
//             format: 'pem',
//             cipher: 'aes-256-cbc',
//             passphrase: secret
//         }
//     }, (err, publicKey, privateKey) => {
//         fs.writeFileSync('public.pem', publicKey);
//         fs.writeFileSync('private.key', privateKey);
//         }
//     )
// }
