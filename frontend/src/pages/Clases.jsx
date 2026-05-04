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
                    {clases.map(clase => (
                        <div key={clase.id} className="card clase-card">
                            <h2>{clase.nombre}</h2>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Clases
