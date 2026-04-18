import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/login'
import Registro from '../pages/registro'
import Perfil from '../pages/Perfil'



function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/perfil" element={<Perfil />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes