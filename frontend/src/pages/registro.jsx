import { useState } from 'react'
import { registroService } from '../services/auth'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Auth.css'

function Registro() {
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await registroService(nombre, email, password)
            navigate('/login')
        } catch (err) {
            setError('Error al registrar usuario')
        }
    }

    return (
        <div className="contenedor-auth">
            <div className="tarjeta-auth">
                <h1 className="titulo-auth">ZENFORCE</h1>
                <h2 className="subtitulo-auth">Crear cuenta</h2>
                {error && <p className="error-auth">{error}</p>}
                <form className="formulario-auth" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="boton-auth">Registrarse</button>
                </form>
                <div className="enlaces-auth">
                    <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Registro
