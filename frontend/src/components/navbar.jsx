import { NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    const navigate = useNavigate()
    const usuario = JSON.parse(localStorage.getItem('usuario'))

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
                    <NavLink to="/qr">Mi QR</NavLink>
                    <NavLink to="/perfil">Mi Perfil</NavLink>
                    {usuario.rol === 'admin' && <NavLink to="/admin">Admin</NavLink>}
                    <span className="separador-nav" />
                    <button onClick={handleLogout}>Cerrar sesión</button>
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
