import { db } from "../data/mongoDB"
import { PhoneActive } from "../models/phoneActivateModel"
import { User } from "../models/userModel"
import { generateCode } from "./generateCodeHelper"
import { Twilio } from 'twilio'

export const sendActivatePhone = async(phone: string) => {
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID?? '';
    const authToken = process.env.TWILIO_AUTH_TOKEN?? '';
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER?? '';

    const client = new Twilio(accountSid,authToken)
    const content = await saveCode(phone)

    client.messages.create({
        body: `Código de ativação -> ${content}`,
        from: twilioNumber,
        to: phone
    }).catch(err => console.log(err))
}

const saveCode = async(phone: string) => {

    const activePhone = db.collection<PhoneActive>('phone_active')
    const user = await db.collection<User>('users').findOne({phone})

    let code = generateCode()

    const IAT = Math.floor(Date.now() / 1000)

    if(user){
        const active = {
            userPhone: user.phone,
            code,
            IAT
        }

        await activePhone.insertOne(active)
    }

    return code
}