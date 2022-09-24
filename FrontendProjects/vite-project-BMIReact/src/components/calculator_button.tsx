import { MouseEventHandler } from "react"

interface CalculatorButton{
    onClickCallback: MouseEventHandler
    label?: string
}

export const BMIButton = ({label = 'Calculate',onClickCallback}: CalculatorButton) => {
    return <button id="btn_calculate" onClick={onClickCallback}>{label}</button>
}