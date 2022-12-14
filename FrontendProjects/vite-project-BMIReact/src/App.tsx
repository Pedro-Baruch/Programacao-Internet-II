import { Input } from './components/input'
import './App.css'
import { useState } from 'react'
import { BMIHeader } from './components/bmi_header'
import { BMIFooter } from './components/bmi_footer'
import { CalculatorButton } from './components/calculator_button'

function App() { 
  
  const [name, setName] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bmi,setBmi] = useState('')

  const onChangeFunctionName = (event: any) => {
    setName(event.target.value);
  }

  const onChangeFunctionWeight = (event: any) => {
    setWeight(event.target.value);
  }

  const onChangeFunctionHeight = (event: any) => {
    setHeight(event.target.value);
  }

  const onClickHandler = () => {

    const bmi = Math.floor(Number(weight) / (Number(height) * Number(height)))
    setBmi(bmi.toString())
  }

  return (
    <div className="App">
      <div id='container'>
        <BMIHeader/>
        <main>
          <h2>Type your data</h2>
          <form action="#">
            <Input type = {'text'} label = {'Name: '} input={name} onChangeCallback={onChangeFunctionName} />
            <Input type = {'number'} label = {'Weight: '} input = {weight} onChangeCallback={onChangeFunctionWeight} />
            <Input type = {'number'} label = {'Height: '} input={height} onChangeCallback={onChangeFunctionHeight} />
            <CalculatorButton onClickCallback={onClickHandler} />  
          </form>
          <section id="result" onClick={onClickHandler}>Seu BMI:
            <span id="bmi">{bmi}</span>
          </section>
          
        </main>
        <BMIFooter/>
      </div>
    </div>
  )
}

export default App
