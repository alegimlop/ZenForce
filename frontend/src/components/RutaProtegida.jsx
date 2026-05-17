import { Navigate } from 'react-router-dom'

function RutaProtegida({ children, soloAdmin = false }) {
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    if (!usuario) return <Navigate to="/" replace />
    if (soloAdmin && usuario.rol !== 'admin') return <Navigate to="/" replace />

    return children
}

export default RutaProtegida