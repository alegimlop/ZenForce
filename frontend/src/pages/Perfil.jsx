import { useState, useEffect } from 'react'
import axios from 'axios'

function Perfil() {
    const [perfil, setPerfil] = useState(null)
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [passwordActual, setPasswordActual] = useState('')
    const [passwordNueva, setPasswordNueva] = useState('')

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuario'))
        if (usuario) {
            axios.get(`http://localhost:3000/api/perfil/${usuario.id}`)
                .then(res => {
                    setPerfil(res.data)
                    setNombre(res.data.nombre)
                    setEmail(res.data.email)
                })
        }
    }, [])

    const handleUpdate = async (e) => {
        e.preventDefault()
        const usuario = JSON.parse(localStorage.getItem('usuario'))
        try {
            await axios.put(`http://localhost:3000/api/perfil/${usuario.id}`, { nombre, email })
            setMensaje('Perfil actualizado correctamente')
        } catch (err) {
            setMensaje('Error al actualizar perfil')
        }
    }

    const handleDelete = async () => {
        const usuario = JSON.parse(localStorage.getItem('usuario'))
        if (confirm('Seguro que quieres eliminar tu cuenta?')) {
            try {
                await axios.delete(`http://localhost:3000/api/perfil/${usuario.id}`)
                localStorage.clear()
                alert('Cuenta eliminada')
                window.location.href = '/registro'
            } catch (err) {
                setMensaje('Error al eliminar cuenta')
            }
        }
    }

    const handlePassword = async (e) => {
        e.preventDefault()
        const usuario = JSON.parse(localStorage.getItem('usuario'))
        try {
            await axios.put(`http://localhost:3000/api/perfil/password/${usuario.id}`, {
                passwordActual,
                passwordNueva
            })
            setMensaje('Contraseña cambiada correctamente')
            setPasswordActual('')
            setPasswordNueva('')
        } catch (err) {
            setMensaje('La contraseña actual es incorrecta')
        }
    }

    if (!perfil) return <p>Cargando perfil...</p>

    return (
        <div>
            <h2>Mi Perfil</h2>
            <p>Membresia: {perfil.membresia || 'Sin membresia'}</p>
            <p>Miembro desde: {new Date(perfil.fecha_registro).toLocaleDateString()}</p>
            {perfil.fecha_fin && <p>Membresia hasta: {new Date(perfil.fecha_fin).toLocaleDateString()}</p>}
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Actualizar</button>
            </form>
            <button onClick={handleDelete}>Eliminar cuenta</button>
            <h3>Cambiar contraseña</h3>
            <form onSubmit={handlePassword}>
                <input
                    type="password"
                    placeholder="Contraseña actual"
                    value={passwordActual}
                    onChange={(e) => setPasswordActual(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña nueva"
                    value={passwordNueva}
                    onChange={(e) => setPasswordNueva(e.target.value)}
                />
                <button type="submit">Cambiar contraseña</button>
            </form>
            {mensaje && <p>{mensaje}</p>}
        </div>
    )
}

export default Perfil