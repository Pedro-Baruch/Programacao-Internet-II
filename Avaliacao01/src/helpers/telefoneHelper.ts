import { db } from "../data/mongodb"
import { ActivateTelefone } from "../repository/activeTelefone"

export const generateCodeTelefone = async (telefone: number, email: string) => {
    
    const activateTelefone = db.collection<ActivateTelefone>('activateTelefone')

    let code: number = generateNum()
    for(code;code <= 9999; code = generateNum()){}

    const foundCode = await activateTelefone.findOne({code})

    if(foundCode){
        for(code; code == foundCode.code; code = generateNum()){} 
    }

    const currentDate = Math.floor(Date.now() / 1000)
    const expDate = currentDate - 3600

    const activate = {
        userEmail: email,
        userTelefone: telefone,
        code,
        expDate
    }

    await activateTelefone.insertOne(activate)

    return code
}

const generateNum = () => {
    return Math.floor(Math.random() * 65536)
}