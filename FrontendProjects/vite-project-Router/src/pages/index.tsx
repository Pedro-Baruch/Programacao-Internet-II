import { Route, Routes } from "react-router-dom";
import { Home } from "./home";
import { Player } from "./players";
import { Teams } from "./teams";

export function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/teams" element={<Teams/>} />
            <Route path="/players" element={<Player/>} />
          </Routes>
    )
}