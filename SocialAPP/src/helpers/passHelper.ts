import bcrypt from 'bcrypt'

export const encrypt = async (pass: string) => {
    
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(pass, salt)

    return passwordHash
}

export const validPass = async (pass: string) => {

    const num: string[] = ["1","2","3","4","5","6","7","8","9"]
    const simbols: string[] = ["~","!","@","#","$","%","^","&","*","-","_","+","=","?",">","<"]

    let hasNum = 0
    let hasSimbols = 0

    if(pass.length < 4){
        return 0
    }else{
        for(let i: number = 0; i < pass.length; i++){
            for(let j: number = 0; j < num.length; j++){
                if(pass[i] == num[j]){
                    hasNum = 1
                }
            }

            for(let u: number = 0; u < simbols.length; u++){
                if(pass[i] == simbols[u]){
                    hasSimbols = 1
                }
            }
        }
    }

    if( hasNum == 1 && hasSimbols == 1){
        return 1
    }else{
        return 0
    }
}