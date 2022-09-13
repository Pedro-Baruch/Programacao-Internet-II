import { db } from "../data/mongoDB"
import { PhoneActive } from "../models/phoneActivateModel"
import { User } from "../models/userModel"
import { generateCode } from "./generateCodeHelper"

export const sendActivatePhone = async(phone: string) => {
    
    const content = await saveCode(phone)
    
    console.log('Código do telefone ->',content)
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