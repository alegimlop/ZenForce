import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/login'
import Registro from '../pages/registro'
import Perfil from '../pages/Perfil'
import Navbar from '../components/navbar'



function AppRoutes() {
    return (
        <BrowserRouter>
        <Navbar/>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/perfil" element={<Perfil />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes