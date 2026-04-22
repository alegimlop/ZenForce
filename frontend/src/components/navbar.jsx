import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    const handleLogout = () => {
        localStorage.clear()
        navigate('/login')
    }

    return (
        <nav>
            <Link to="/">ZenForce</Link>
            {usuario ? (
                <>
                    <Link to="/clases">Clases</Link>
                    <Link to="/foro">Foro</Link>
                    <Link to="/perfil">Mi Perfil</Link>
                    {usuario.rol === 'admin' && <Link to="/admin">Admin</Link>}
                    <button onClick={handleLogout}>Cerrar sesion</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/registro">Registro</Link>
                </>
            )}
        </nav>
    )
}

export default Navbar