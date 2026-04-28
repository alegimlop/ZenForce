import { NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    const navigate = useNavigate()
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    const handleLogout = () => {
        localStorage.clear()
        navigate('/login')
    }
//Componente de navegación
//  que muestra diferentes enlaces según si el usuario está autenticado
    return (
        <nav>
            <NavLink to="/">ZenForce</NavLink>
            <NavLink to="/sobre-nosotros">Sobre Nosotros</NavLink>
            {usuario ? (
                <>
                    <NavLink to="/clases">Clases</NavLink>
                    <NavLink to="/foro">Foro</NavLink>
                    <NavLink to="/perfil">Mi Perfil</NavLink>
                    {usuario.rol === 'admin' && <NavLink to="/admin">Admin</NavLink>}
                    <button onClick={handleLogout}>Cerrar sesion</button>
                </>
            ) : (
                <>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/registro">Registro</NavLink>
                </>
            )}
        </nav>
    )
}

export default Navbar