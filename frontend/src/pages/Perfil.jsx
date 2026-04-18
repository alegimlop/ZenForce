import { useState, useEffect } from 'react'
import axios from 'axios'

function Perfil() {
    const [perfil, setPerfil] = useState(null)
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [mensaje, setMensaje] = useState('')

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
            {mensaje && <p>{mensaje}</p>}
        </div>
    )
}

export default Perfil