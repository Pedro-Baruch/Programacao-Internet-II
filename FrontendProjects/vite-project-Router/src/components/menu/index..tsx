import { Link } from "react-router-dom"

export const Menu = () =>{
    return(
        <header>
          <h1>Copa 2022</h1>
          <nav className='Menu'>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to='/teams'>Teams</Link></li>
              <li><Link to='/players'>Players</Link></li>
            </ul>
          </nav>
        </header>
    )
} 