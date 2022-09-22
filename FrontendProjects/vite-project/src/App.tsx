import { BMIHeader } from './components/BMIHeader'
import { BMIForm } from './components/BMIForm'
import { BMIButton } from './components/BMIButton'
import { BMIFooter } from './components/BMIFooter'
import './App.css'

function App() { 

  return (
    <div className="App">
      <div id='container'>
        <BMIHeader/>
        <BMIForm/>
        <BMIButton/>
        <BMIFooter/>
      </div>
    </div>
  )
}

export default App
