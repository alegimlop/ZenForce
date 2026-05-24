import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../styles/Auth.css'
import API_URL from '../config'

function RestablecerPassword() {
    const [email, setEmail] = useState('')
    const [passwordNueva, setPasswordNueva] = useState('')
    const [mensaje, setMensaje] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`${API_URL}/perfil/restablecer`, { email, passwordNueva })
            setMensaje('Contraseña restablecida correctamente')
        } catch {
            setMensaje('Email no encontrado')
        }
    }

    return (
        <div className="contenedor-auth">
            <div className="tarjeta-auth">
                <h1 className="titulo-auth">ZENFORCE</h1>
                <h2 className="subtitulo-auth">Restablecer contraseña</h2>
                <form className="formulario-auth" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={passwordNueva}
                        onChange={(e) => setPasswordNueva(e.target.value)}
                    />
                    <button type="submit" className="boton-auth">Restablecer</button>
                </form>
                {mensaje && <p className={mensaje.includes('correctamente') ? 'mensaje-ok-auth' : 'error-auth'}>{mensaje}</p>}
                <div className="enlaces-auth">
                    <p><Link to="/login">Volver al login</Link></p>
                </div>
            </div>
        </div>
    )
}

export default RestablecerPassword