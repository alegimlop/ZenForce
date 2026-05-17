import { useState, useEffect } from 'react'
import axios from 'axios'
import './Clases.css'
import API_URL from '../config'
const API = `${API_URL}/clases`

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
            weekday: 'long', day: '2-digit', month: 'long'
        })
    }

    return (
        <div className="contenedor-pagina contenedor-clases">
            <div className="cabecera-clases">
                <h1>Clases de Fitness</h1>
                <p>Apúntate a nuestras clases y empieza a entrenar</p>
            </div>

            {mensaje.texto && (
                <p className={mensaje.tipo === 'ok' ? 'mensaje-correcto' : 'mensaje-error'}>
                    {mensaje.texto}
                </p>
            )}

            {clases.length === 0 ? (
                <div className="tarjeta-vacia">
                    <p>No hay clases disponibles en este momento.</p>
                </div>
            ) : (
                <div className="cuadricula-clases">
                    {clases.map(clase => {
                        const llena = clase.inscritos >= clase.capacidad
                        const inscrito = estaInscrito(clase.id)

                        return (
                            <div key={clase.id} className="tarjeta-clase">
                                <div className="cabecera-tarjeta">
                                    <h2>{clase.nombre}</h2>
                                    <span className={`etiqueta-plazas ${llena ? 'completa' : ''}`}>
                                        {llena ? 'Completa' : `${clase.capacidad - clase.inscritos} plazas`}
                                    </span>
                                </div>
                                {clase.descripcion && <p className="descripcion-clase">{clase.descripcion}</p>}
                                <div className="info-clase">
                                    {clase.instructor && <p><span className="etiqueta-info">Instructor</span> {clase.instructor}</p>}
                                    {clase.hora && <p><span className="etiqueta-info">Horario</span> {clase.hora.substring(0, 5)}</p>}
                                    {clase.fecha && <p><span className="etiqueta-info">Fecha</span> {formatFecha(clase.fecha)}</p>}
                                    <p><span className="etiqueta-info">Plazas</span> {clase.inscritos} / {clase.capacidad}</p>
                                </div>
                                {usuario ? (
                                    inscrito ? (
                                        <button className="boton-cancelar" onClick={() => cancelar(clase.id)}>
                                            Cancelar inscripción
                                        </button>
                                    ) : (
                                        <button
                                            className="boton-inscribir"
                                            onClick={() => inscribirse(clase.id)}
                                            disabled={llena}
                                        >
                                            {llena ? 'Clase completa' : 'Inscribirme'}
                                        </button>
                                    )
                                ) : (
                                    <p className="aviso-sesion">Inicia sesión para inscribirte</p>
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
