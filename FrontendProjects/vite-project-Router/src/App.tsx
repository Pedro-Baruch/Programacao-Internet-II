import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Home } from './pages/home'
import { Teams } from './pages/teams'
import { Player } from './pages/players'
import { AppRoutes } from './pages'
import { Menu } from './components/menu/index.'
import { AppFooter } from './components/footer'

function App() {

  return (
    <div className='App'>
      <Router>
        <Menu/>
        <main>
          <AppRoutes/>
        </main>
        <AppFooter/>
      </Router>
    </div>
  )
}

export default App
