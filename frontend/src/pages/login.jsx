import { useState } from 'react'
import { loginService } from '../services/auth'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = await loginService(email, password)
            localStorage.setItem('token', data.token)
            localStorage.setItem('usuario', JSON.stringify(data.usuario))
            navigate('/')
        } catch (err) {
            setError('Email o contraseña incorrectos')
        }
    }

    return (
        <div className="contenedor-auth">
            <div className="tarjeta-auth">
                <h1 className="titulo-auth">ZENFORCE</h1>
                <h2 className="subtitulo-auth">Iniciar sesión</h2>
                {error && <p className="error-auth">{error}</p>}
                <form className="formulario-auth" onSubmit={handleSubmit}>
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
                    <button type="submit" className="boton-auth">Entrar</button>
                </form>
                <div className="enlaces-auth">
                    <p>¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
                    <p>¿Olvidaste tu contraseña? <Link to="/restablecer-password">Restablécela aquí</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login
