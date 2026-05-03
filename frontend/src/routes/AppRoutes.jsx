import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/login'
import Registro from '../pages/registro'
import Perfil from '../pages/Perfil'
import Navbar from '../components/navbar'
import RutaProtegida from '../components/RutaProtegida'
import Inicio from '../pages/Inicio'
import SobreNosotros from '../pages/SobreNosotros'
import RestablecerPassword from '../pages/RestablecerPassword'
import Admin from '../pages/Admin'
import QR from '../pages/QR'
import Foro from '../pages/Foro'

function AppRoutes() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/sobre-nosotros" element={<SobreNosotros />} />
                <Route path="/restablecer-password" element={<RestablecerPassword />} />
                <Route path="/perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />
                <Route path="/foro" element={<Foro />} />
                <Route path="/qr" element={<RutaProtegida><QR /></RutaProtegida>} />
                <Route path="/admin" element={<RutaProtegida><Admin /></RutaProtegida>} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes