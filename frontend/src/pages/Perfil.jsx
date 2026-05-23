import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Perfil.css'
import API_URL from '../config'
import { useNavigate } from 'react-router-dom'

function Perfil() {
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    const navigate = useNavigate()
    const [perfil, setPerfil] = useState(null)
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [passwordActual, setPasswordActual] = useState('')
    const [passwordNueva, setPasswordNueva] = useState('')

    useEffect(() => {
        if (usuario) {
            axios.get(`${API_URL}/perfil/${usuario.id}`)
                .then(res => {
                    setPerfil(res.data)
                    setNombre(res.data.nombre)
                    setEmail(res.data.email)
                })
        }
    }, [])

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`${API_URL}/perfil/${usuario.id}`, { nombre, email })
            setMensaje('Perfil actualizado correctamente')
        } catch {
            setMensaje('Error al actualizar perfil')
        }
    }

    const handleDelete = async () => {
        if (confirm('¿Seguro que quieres eliminar tu cuenta?')) {
            try {
                await axios.delete(`${API_URL}/perfil/${usuario.id}`)
                localStorage.clear()
                alert('Cuenta eliminada')
                navigate('/')
            } catch {
                setMensaje('Error al eliminar cuenta')
            }
        }
    }

    const handlePassword = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`${API_URL}/perfil/password/${usuario.id}`, {
                passwordActual,
                passwordNueva
            })
            setMensaje('Contraseña cambiada correctamente')
            setPasswordActual('')
            setPasswordNueva('')
        } catch {
            setMensaje('La contraseña actual es incorrecta')
        }
    }

    const handleCancelarSuscripcion = async () => {
        if (confirm('¿Seguro que quieres cancelar tu suscripción?')) {
            try {
                await axios.put(`${API_URL}/perfil/cancelar/${usuario.id}`)
                setMensaje('Suscripción cancelada correctamente')
                setPerfil({ ...perfil, membresia: null, fecha_fin: null })
            } catch {
                setMensaje('Error al cancelar suscripción')
            }
        }
    }

    if (!perfil) return <p className="cargando">Cargando perfil...</p>

    return (
        <div className="contenedor-pagina contenedor-perfil">
            <div className="cabecera-perfil">
                <h1>Mi Perfil</h1>
                <div className="info-membresia">
                    <span className="etiqueta-membresia">{perfil.membresia ? `Suscripción: ${perfil.membresia}` : 'Sin suscripción'}</span>
                    {perfil.membresia && (
                        <button className="boton-eliminar" onClick={handleCancelarSuscripcion}>Cancelar suscripción</button>
                    )}
                    <p>Miembro desde: {new Date(perfil.fecha_registro).toLocaleDateString()}</p>
                    {perfil.fecha_fin && <p>Membresía hasta: {new Date(perfil.fecha_fin).toLocaleDateString()}</p>}
                </div>
            </div>

            <div className="cuadricula-perfil">
                <div className="tarjeta-perfil">
                    <h2>Datos personales</h2>
                    <form className="formulario-perfil" onSubmit={handleUpdate}>
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
                        <button type="submit" className="boton-guardar">Actualizar</button>
                    </form>
                    <button className="boton-eliminar" onClick={handleDelete}>Eliminar cuenta</button>
                </div>

                <div className="tarjeta-perfil">
                    <h2>Cambiar contraseña</h2>
                    <form className="formulario-perfil" onSubmit={handlePassword}>
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
                        <button type="submit" className="boton-guardar">Cambiar contraseña</button>
                    </form>
                </div>
            </div>

            {mensaje && <p className="mensaje-perfil">{mensaje}</p>}
        </div>
    )
}

export default Perfil