import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:3000/api/foro'

function Foro() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        cargarPosts()
    }, [])

    const cargarPosts = async () => {
        const res = await axios.get(`${API}/posts`)
        setPosts(res.data)
    }

    const formatFecha = (fecha) => new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric'
    })

    return (
        <div className="contenedor-pagina">
            <h1>Foro</h1>
            {posts.length === 0 ? (
                <div className="tarjeta">
                    <p>No hay posts aun. Se el primero en publicar.</p>
                </div>
            ) : (
                <div className="lista-posts">
                    {posts.map(post => (
                        <div key={post.id} className="tarjeta">
                            <h2>{post.titulo}</h2>
                            <p>Por <strong>{post.autor}</strong> · {formatFecha(post.fecha_creacion)}</p>
                            <p>{post.contenido.substring(0, 120)}{post.contenido.length > 120 ? '...' : ''}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Foro