import { ChangeEventHandler } from "react"

interface InputProps{
    label: string
    input : string
    type: string
    onChangeCallback : ChangeEventHandler
}

export function Input({input,label,type, onChangeCallback}:InputProps){
    return (
        <div className="input-control">
            <label htmlFor="">{label}</label>
            <input type={type} value={input} onChange={onChangeCallback} /> 
        </div>
    )
}