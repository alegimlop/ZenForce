import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function RestablecerPassword() {
    const [email, setEmail] = useState('')
    const [passwordNueva, setPasswordNueva] = useState('')
    const [mensaje, setMensaje] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.put('http://localhost:3000/api/perfil/restablecer', { email, passwordNueva })
            setMensaje('Contraseña restablecida correctamente')
        } catch (err) {
            setMensaje('Email no encontrado')
        }
    }

    return (
        <div>
            <h2>Restablecer contraseña</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Restablecer</button>
            </form>
            {mensaje && <p>{mensaje}</p>}
            <Link to="/login">Volver al login</Link>
        </div>
    )
}

export default RestablecerPassword