import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:3000/api/clases'

function Clases() {
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    const [clases, setClases] = useState([])
    const [misClases, setMisClases] = useState([])
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })

    useEffect(() => {
        cargarClases()
        if (usuario) cargarMisClases()
    }, [])

    const cargarClases = async () => {
        try {
            const res = await axios.get(API)
            setClases(res.data)
        } catch (err) {
            setMensaje({ texto: 'Error al conectar con el servidor', tipo: 'error' })
        }
    }

    const cargarMisClases = async () => {
        const res = await axios.get(`${API}/mis-clases/${usuario.id}`)
        setMisClases(res.data.map(c => c.id))
    }

    const estaInscrito = (claseId) => misClases.includes(claseId)

    const inscribirse = async (claseId) => {
        try {
            await axios.post(`${API}/${claseId}/inscribir`, { usuario_id: usuario.id })
            setMensaje({ texto: 'Inscripción realizada correctamente', tipo: 'ok' })
            await cargarClases()
            await cargarMisClases()
        } catch (err) {
            setMensaje({ texto: err.response?.data?.error || 'Error al inscribirse', tipo: 'error' })
        }
    }

    const cancelar = async (claseId) => {
        if (!confirm('¿Cancelar tu inscripción?')) return
        try {
            await axios.delete(`${API}/${claseId}/inscribir`, { data: { usuario_id: usuario.id } })
            setMensaje({ texto: 'Inscripción cancelada', tipo: 'ok' })
            await cargarClases()
            await cargarMisClases()
        } catch {
            setMensaje({ texto: 'Error al cancelar la inscripción', tipo: 'error' })
        }
    }

    const formatFecha = (fecha) => {
        if (!fecha) return 'Sin fecha'
        return new Date(fecha).toLocaleDateString('es-ES', {
            weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
        })
    }

    return (
        <div className="page-container">
            <div className="clases-header">
                <h1>Clases de Fitness</h1>
                <p>Apúntate a nuestras clases y empieza a entrenar</p>
            </div>

            {mensaje.texto && (
                <p className={mensaje.tipo === 'ok' ? 'mensaje-ok' : 'mensaje-error'}>
                    {mensaje.texto}
                </p>
            )}

            {clases.length === 0 ? (
                <div className="card sin-clases">
                    <p>No hay clases disponibles en este momento.</p>
                </div>
            ) : (
                <div className="clases-grid">
                    {clases.map(clase => {
                        const llena = clase.inscritos >= clase.capacidad
                        const inscrito = estaInscrito(clase.id)

                        return (
                            <div key={clase.id} className="card clase-card">
                                <div className="clase-header">
                                    <h2>{clase.nombre}</h2>
                                    <span className={`clase-badge ${llena ? 'llena' : ''}`}>
                                        {llena ? 'Completa' : `${clase.capacidad - clase.inscritos} plazas`}
                                    </span>
                                </div>
                                {clase.descripcion && <p className="clase-descripcion">{clase.descripcion}</p>}
                                <div className="clase-info">
                                    {clase.instructor && <p>Instructor: {clase.instructor}</p>}
                                    {clase.horario && <p>Horario: {clase.horario}</p>}
                                    {clase.fecha && <p>fecha: {formatFecha(clase.fecha)}</p>}
                                    <p>plazas: {clase.inscritos} / {clase.capacidad} inscritos</p>
                                </div>
                                {usuario ? (
                                    inscrito ? (
                                        <button className="btn-danger" onClick={() => cancelar(clase.id)}>
                                            Cancelar inscripción
                                        </button>
                                    ) : (
                                        <button
                                            className="btn-success"
                                            onClick={() => inscribirse(clase.id)}
                                            disabled={llena}
                                        >
                                            {llena ? 'Clase completa' : 'Inscribirme'}
                                        </button>
                                    )
                                ) : (
                                    <p className="aviso-login">Inicia sesión para inscribirte</p>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Clases
