import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/login'
import Registro from '../pages/registro'
import Perfil from '../pages/Perfil'
import Navbar from '../components/navbar'
import Admin from '../pages/Admin'
import Inicio from '../pages/Inicio'
import SobreNosotros from '../pages/SobreNosotros'
import RestablecerPassword from '../pages/RestablecerPassword'
import Foro from '../pages/Foro'
import Clases from '../pages/Clases'
import QR from '../pages/QR'
import RutaProtegida from '../components/RutaProtegida'

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
                <Route path="/foro" element={<Foro />} />
                <Route path="/clases" element={<Clases />} />
                <Route path="/perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />
                <Route path="/qr" element={<RutaProtegida><QR /></RutaProtegida>} />
                <Route path="/admin" element={<RutaProtegida><Admin /></RutaProtegida>} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
