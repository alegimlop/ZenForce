import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:3000/api/foro'

function Foro() {
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    const [posts, setPosts] = useState([])
    const [vista, setVista] = useState('lista')
    const [titulo, setTitulo] = useState('')
    const [contenido, setContenido] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [postDetalle, setPostDetalle] = useState(null)
    const [comentario, setComentario] = useState('')

    useEffect(() => {
        cargarPosts()
    }, [])

    const cargarPosts = async () => {
        const res = await axios.get(`${API}/posts`)
        setPosts(res.data)
    }

    const abrirPost = async (id) => {
        const res = await axios.get(`${API}/posts/${id}`)
        setPostDetalle(res.data)
        setVista('detalle')
    }

    const crearPost = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${API}/posts`, { titulo, contenido, usuario_id: usuario.id })
            setTitulo('')
            setContenido('')
            setMensaje('Post publicado correctamente')
            await cargarPosts()
            setVista('lista')
        } catch {
            setMensaje('Error al publicar el post')
        }
    }

    const eliminarPost = async (id) => {
        if (!confirm('¿Eliminar este post?')) return
        try {
            await axios.delete(`${API}/posts/${id}`, { data: { usuario_id: usuario.id } })
            await cargarPosts()
            setVista('lista')
        } catch {
            setMensaje('Error al eliminar el post')
        }
    }

    const enviarComentario = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${API}/posts/${postDetalle.id}/comentarios`, {
                contenido: comentario,
                usuario_id: usuario.id
            })
            setComentario('')
            const res = await axios.get(`${API}/posts/${postDetalle.id}`)
            setPostDetalle(res.data)
        } catch {
            setMensaje('Error al añadir comentario')
        }
    }
    const eliminarComentario = async (comentarioId) => {
        if (!confirm('¿Eliminar este comentario?')) return
        try {
            await axios.delete(`${API}/comentarios/${comentarioId}`, { data: { usuario_id: usuario.id } })
            const res = await axios.get(`${API}/posts/${postDetalle.id}`)
            setPostDetalle(res.data)
        } catch {
            setMensaje('No puedes eliminar este comentario')
        }
    }
    const formatFecha = (fecha) => new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric'
    })

    if (vista === 'crear') return (
        <div className="contenedor-pagina">
            <h1>Nuevo Post</h1>
            <button onClick={() => setVista('lista')}>Volver</button>
            {mensaje && <p>{mensaje}</p>}
            <div className="tarjeta">
                <form onSubmit={crearPost}>
                    <input
                        type="text"
                        placeholder="Titulo del post"
                        value={titulo}
                        onChange={e => setTitulo(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="¿Que quieres compartir?"
                        value={contenido}
                        onChange={e => setContenido(e.target.value)}
                        rows={6}
                        required
                    />
                    <button type="submit">Publicar</button>
                </form>
            </div>
        </div>
    )

if (vista === 'detalle' && postDetalle) return (
    <div className="contenedor-pagina">
        <button onClick={() => setVista('lista')}>Volver</button>
        <div className="tarjeta">
            <h2>{postDetalle.titulo}</h2>
            <p>Por <strong>{postDetalle.autor}</strong> · {formatFecha(postDetalle.fecha_creacion)}</p>
            <p>{postDetalle.contenido}</p>
            {usuario && usuario.id === postDetalle.usuario_id && (
                <button onClick={() => eliminarPost(postDetalle.id)}>Eliminar post</button>
            )}
            <div>
                <h3>Comentarios ({postDetalle.comentarios?.length || 0})</h3>
                {postDetalle.comentarios?.map(c => (
                    <div key={c.id} className="tarjeta">
                        <strong>{c.autor}</strong>
                        <p>{c.contenido}</p>
                        {usuario && usuario.id === c.usuario_id && (
                            <button onClick={() => eliminarComentario(c.id)}>Eliminar</button>
                        )}
                    </div>
                ))}
                {usuario && (
                    <form onSubmit={enviarComentario}>
                        <textarea
                            placeholder="Escribe un comentario..."
                            value={comentario}
                            onChange={e => setComentario(e.target.value)}
                            rows={3}
                            required
                        />
                        <button type="submit">Comentar</button>
                    </form>
                )}
            </div>
        </div>
    </div>
)

    return (
        <div className="contenedor-pagina">
            <h1>Foro</h1>
            {usuario && (
                <button onClick={() => setVista('crear')}>Nuevo post</button>
            )}
            {mensaje && <p>{mensaje}</p>}
            {posts.length === 0 ? (
                <div className="tarjeta">
                    <p>No hay posts aun. Se el primero en publicar.</p>
                </div>
            ) : (
                <div className="lista-posts">
                    {posts.map(post => (
                        <div key={post.id} className="tarjeta" onClick={() => abrirPost(post.id)}>
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