import { db } from "../data/mongodb"
import { ActivateTelefone } from "../repository/activeTelefone"

export const createCodeTelefone = async (telefone: number, email: string) => {
    
    const activateTelefone = db.collection<ActivateTelefone>('activateTelefone')
    let code: number = await generateCode()

    const currentDate = Math.floor(Date.now() / 1000)
    const iatDate = currentDate

    const activate = {
        userEmail: email,
        userTelefone: telefone,
        code,
        iatDate
    }

    await activateTelefone.insertOne(activate)

    return code
}

export const refreshTelefone = async (telefone: number) => {
    
    const activateTelefone = db.collection<ActivateTelefone>('activateTelefone')
    let code: number = await generateCode()

    const currentDate = Math.floor(Date.now() / 1000)
    const iatDate = currentDate

    const filter = {userTelefone: telefone}
    const updateDocument = {
        $set: {
            code,
            iatDate
        }
    }

    await activateTelefone.updateOne(filter,updateDocument)
}

const generateCode = async () => {

    let code: number = generateNum()
    
    for(code;code <= 9999; code = generateNum()){}

    return code
}

const generateNum = () => {
    return Math.floor(Math.random() * 65536)
}