import { useState } from 'react'
import { loginService } from '../services/auth'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        const data = await loginService(email, password)
        localStorage.setItem('token', data.token)
        localStorage.setItem('usuario', JSON.stringify(data.usuario))
        alert('Login correcto')
    } catch (err) {
        setError('Email o contraseña incorrectos')
    }
}

    return (
        <div>
            <h2>Iniciar sesion</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contrasena"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Entrar</button>
            </form>
        </div>
    )
}

export default Login