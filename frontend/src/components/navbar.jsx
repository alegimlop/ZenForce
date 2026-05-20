import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import '../styles/Navbar.css'

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    if (location.pathname === '/admin') return null

    const handleLogout = () => {
        localStorage.clear()
        navigate('/login')
    }

    return (
        <nav>
            <NavLink to="/">ZenForce</NavLink>
            <NavLink to="/sobre-nosotros">Sobre Nosotros</NavLink>
            {usuario ? (
                <>
                    <NavLink to="/clases">Clases</NavLink>
                    <NavLink to="/foro">Foro</NavLink>
                    <NavLink to="/membresias">Membresías</NavLink>
                    <NavLink to="/qr">Mi QR</NavLink>
                    <NavLink to="/perfil">Mi Perfil</NavLink>
                    {usuario.rol === 'admin' && <NavLink to="/admin">Admin</NavLink>}
                    <span className="separador-nav" />
                    <button onClick={handleLogout}>Cerrar sesión</button>
                    <div id="google_translate_element" style={{display: 'none'}}></div>
                    <button onClick={() => document.querySelector('.goog-te-gadget-simple').click()} className="boton-idioma">
                        🌍
                    </button>
                </>
            ) : (
                <>
                    <span className="separador-nav" />
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/registro">Registro</NavLink>
                </>
            )}
        </nav>
    )
}

export default Navbar
