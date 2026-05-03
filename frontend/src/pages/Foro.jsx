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

    useEffect(() => {
        cargarPosts()
    }, [])

    const cargarPosts = async () => {
        const res = await axios.get(`${API}/posts`)
        setPosts(res.data)
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