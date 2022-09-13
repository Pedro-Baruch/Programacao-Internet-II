import bcrypt from 'bcrypt'

export const encrypt = async (password:string) => {
    const salt: string = await bcrypt.genSalt(12)
    const passwordHash: string = await bcrypt.hash(password,salt)

    return passwordHash
}

export const decrypt = async (firstPassword: string, secondPassword: string) => {
    const verifyPassword: boolean = await bcrypt.compare(firstPassword, secondPassword)

    return verifyPassword
}