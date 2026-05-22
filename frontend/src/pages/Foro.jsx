import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Foro.css'
import API_URL from '../config'
import iconoCorreo from '../assets/correo.png'
const API = `${API_URL}/foro`

function Foro() {
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    const [posts, setPosts] = useState([])
    const [vista, setVista] = useState('lista')
    const [titulo, setTitulo] = useState('')
    const [contenido, setContenido] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [postDetalle, setPostDetalle] = useState(null)
    const [comentario, setComentario] = useState('')
    const [liked, setLiked] = useState(false)
    const [totalLikes, setTotalLikes] = useState(0)
    const [editando, setEditando] = useState(false)
    const [tituloEdit, setTituloEdit] = useState('')
    const [contenidoEdit, setContenidoEdit] = useState('')
    const [comentarioEditandoId, setComentarioEditandoId] = useState(null)
    const [contenidoEditComentario, setContenidoEditComentario] = useState('')
    const [filtro, setFiltro] = useState('todos')
    const [misComentarios, setMisComentarios] = useState([])
    const [comentarioEnviado, setComentarioEnviado] = useState(false)
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
        setTotalLikes(res.data.total_likes || 0)
        if (usuario) {
            const likeRes = await axios.get(`${API}/posts/${id}/like/${usuario.id}`)
            setLiked(likeRes.data.liked)
        }
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
            if (filtro === 'misPosts') {
                await filtrarMisPosts()
            } else if (filtro === 'misLikes') {
                await filtrarMisLikes()
            } else {
                await cargarPosts()
            }
            setVista('lista')
        } catch {
            setMensaje('Error al eliminar el post')
        }
    }

    const guardarEdicionPost = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`${API}/posts/${postDetalle.id}`, {
                titulo: tituloEdit,
                contenido: contenidoEdit,
                usuario_id: usuario.id
            })
            const res = await axios.get(`${API}/posts/${postDetalle.id}`)
            setPostDetalle(res.data)
            setEditando(false)
        } catch {
            setMensaje('Error al editar el post')
        }
    }

const darLike = async () => {
    if (!usuario) return
    const res = await axios.post(`${API}/posts/${postDetalle.id}/like`, { usuario_id: usuario.id })
    setLiked(res.data.liked)
    setTotalLikes(prev => res.data.liked ? prev + 1 : prev - 1)
    if (filtro === 'misLikes') {
        await filtrarMisLikes()
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
            setComentarioEnviado(true)
            setTimeout(() => setComentarioEnviado(false), 2500)
            const res = await axios.get(`${API}/posts/${postDetalle.id}`)
            setPostDetalle(res.data)
            setPosts(prev => prev.map(p =>
                p.id === postDetalle.id
                    ? { ...p, total_comentarios: (p.total_comentarios || 0) + 1 }
                    : p
            ))
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
            setPosts(prev => prev.map(p =>
                p.id === postDetalle.id
                    ? { ...p, total_comentarios: Math.max(0, (p.total_comentarios || 1) - 1) }
                    : p
            ))
            if (filtro === 'misComentarios') {
                await filtrarMisComentarios()
            }
        } catch {
            setMensaje('No puedes eliminar este comentario')
        }
    }

    const guardarEdicionComentario = async (e, comentarioId) => {
        e.preventDefault()
        try {
            await axios.put(`${API}/comentarios/${comentarioId}`, {
                contenido: contenidoEditComentario,
                usuario_id: usuario.id
            })
            setComentarioEditandoId(null)
            const res = await axios.get(`${API}/posts/${postDetalle.id}`)
            setPostDetalle(res.data)
        } catch {
            setMensaje('Error al editar el comentario')
        }
    }

    const formatFecha = (fecha) => new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric'
    })

    const formatFechaRelativa = (fecha) => {
        const ahora = new Date()
        const f = new Date(fecha)
        const diffHoras = Math.floor((ahora - f) / (1000 * 60 * 60))
        const diffDias = Math.floor((ahora - f) / (1000 * 60 * 60 * 24))
        const hora = f.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        if (diffHoras < 24) return `Hoy a las ${hora}`
        if (diffDias === 1) return `Ayer a las ${hora}`
        return `${f.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })} a las ${hora}`
    }

    const coloresIcono = ['#e74c3c', '#8e44ad', '#27ae60', '#2980b9', '#e67e22', '#c0392b']
    const getColorIcono = (id) => coloresIcono[id % coloresIcono.length]
    const filtrarMisPosts = async () => {
        const res = await axios.get(`${API}/misposts/${usuario.id}`)
        setPosts(res.data)
        setFiltro('misPosts')
    }

    const filtrarMisLikes = async () => {
        const res = await axios.get(`${API}/misleaks/${usuario.id}`)
        setPosts(res.data)
        setFiltro('misLikes')
    }

    const verTodos = async () => {
        await cargarPosts()
        setFiltro('todos')
    }
    const filtrarMisComentarios = async () => {
        const res = await axios.get(`${API}/miscomentarios/${usuario.id}`)
        setMisComentarios(res.data)
        setFiltro('misComentarios')
    }
    if (vista === 'crear') return (
        <div className="contenedor-pagina contenedor-foro">
            <div className="cabecera-foro">
                <h1>Nuevo Post</h1>
                <button className="boton-volver" onClick={() => setVista('lista')}>← Volver al foro</button>
            </div>
            {mensaje && <p className="mensaje-foro">{mensaje}</p>}
            <div className="tarjeta-foro">
                <form className="formulario-post" onSubmit={crearPost}>
                    <input
                        type="text"
                        placeholder="Título del post"
                        value={titulo}
                        onChange={e => setTitulo(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="¿Qué quieres compartir?"
                        value={contenido}
                        onChange={e => setContenido(e.target.value)}
                        rows={6}
                        required
                    />
                    <button type="submit" className="boton-publicar">Publicar</button>
                </form>
            </div>
        </div>
    )

    if (vista === 'detalle' && postDetalle) return (
        <div className="contenedor-pagina contenedor-foro">
            <button className="boton-volver" onClick={() => setVista('lista')}>← Volver al foro</button>
            <div className="tarjeta-foro tarjeta-detalle">
                <div className="cabecera-detalle">
                    <h2>{postDetalle.titulo}</h2>
                    <p className="meta-post">Por <strong>{postDetalle.autor}</strong> · {formatFecha(postDetalle.fecha_creacion)}</p>
                </div>
                <p className="contenido-post">{postDetalle.contenido}</p>
                <div className="acciones-post">
                    <button className={`boton-like ${liked ? 'activo' : ''}`} onClick={darLike} disabled={!usuario}>
                        {liked ? '❤️' : '🤍'} {totalLikes}
                    </button>
                    {usuario && usuario.id === postDetalle.usuario_id && (
                        <div className="botones-edicion">
                            <button className="boton-editar" onClick={() => {
                                setEditando(true)
                                setTituloEdit(postDetalle.titulo)
                                setContenidoEdit(postDetalle.contenido)
                            }}>Editar</button>
                            <button className="boton-eliminar" onClick={() => eliminarPost(postDetalle.id)}>Eliminar</button>
                        </div>
                    )}
                </div>
                {editando && (
                    <form className="formulario-post" onSubmit={guardarEdicionPost}>
                        <input
                            type="text"
                            value={tituloEdit}
                            onChange={e => setTituloEdit(e.target.value)}
                            required
                        />
                        <textarea
                            value={contenidoEdit}
                            onChange={e => setContenidoEdit(e.target.value)}
                            rows={4}
                            required
                        />
                        <div className="botones-edicion">
                            <button type="submit" className="boton-publicar">Guardar</button>
                            <button type="button" className="boton-volver" onClick={() => setEditando(false)}>Cancelar</button>
                        </div>
                    </form>
                )}
                <div className="seccion-comentarios">
                    <h3>Comentarios ({postDetalle.comentarios?.length || 0})</h3>
                    {postDetalle.comentarios?.map(c => (
                        <div key={c.id} className="tarjeta-comentario">
                            <strong className="autor-comentario">{c.autor}</strong>
                            {comentarioEditandoId === c.id ? (
                                <form className="formulario-post" onSubmit={e => guardarEdicionComentario(e, c.id)}>
                                    <textarea
                                        value={contenidoEditComentario}
                                        onChange={e => setContenidoEditComentario(e.target.value)}
                                        rows={2}
                                        required
                                    />
                                    <div className="botones-edicion">
                                        <button type="submit" className="boton-publicar">Guardar</button>
                                        <button type="button" className="boton-volver" onClick={() => setComentarioEditandoId(null)}>Cancelar</button>
                                    </div>
                                </form>
                            ) : (
                                <p>{c.contenido}</p>
                            )}
                            {usuario && usuario.id === c.usuario_id && comentarioEditandoId !== c.id && (
                                <div className="botones-edicion">
                                    <button className="boton-editar" onClick={() => {
                                        setComentarioEditandoId(c.id)
                                        setContenidoEditComentario(c.contenido)
                                    }}>Editar</button>
                                    <button className="boton-eliminar" onClick={() => eliminarComentario(c.id)}>Eliminar</button>
                                </div>
                            )}
                        </div>
                    ))}
                    {usuario && (
                        <form className="formulario-comentario" onSubmit={enviarComentario}>
                            <textarea
                                placeholder="Escribe un comentario..."
                                value={comentario}
                                onChange={e => setComentario(e.target.value)}
                                rows={3}
                                required
                            />
                            <div className="pie-comentario">
                                <button type="submit" className="boton-publicar">Comentar</button>
                                {comentarioEnviado && <span className="confirmacion-comentario">✓ Comentario publicado</span>}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <div className="contenedor-pagina contenedor-foro">
            <div className="cabecera-foro">
                <h1>Foro</h1>
                {usuario && (
                    <div className="botones-cabecera-foro">                        
                        <button className={`boton-filtro ${filtro === 'todos' ? 'activo' : ''}`} onClick={verTodos}>Todos</button>
                        <button className={`boton-filtro ${filtro === 'misPosts' ? 'activo' : ''}`} onClick={filtrarMisPosts}>Mis posts</button>
                        <button className={`boton-filtro ${filtro === 'misLikes' ? 'activo' : ''}`} onClick={filtrarMisLikes}>Mis likes</button>
                        <button className={`boton-filtro ${filtro === 'misComentarios' ? 'activo' : ''}`} onClick={filtrarMisComentarios}>Mis comentarios</button>
                        <button className="boton-nuevo" onClick={() => setVista('crear')}>+ Nuevo post</button>
                    </div>
                )}
            </div>
            {mensaje && <p className="mensaje-foro">{mensaje}</p>}

            {filtro === 'misComentarios' ? (
                <div className="lista-posts">
                    <div className="cabecera-hilos">
                        <span>Mis comentarios</span>
                    </div>
                    {misComentarios.length === 0 ? (
                        <div className="tarjeta-vacia">No has comentado nada aún.</div>
                    ) : (
                        misComentarios.map(c => (
                            <div key={c.id} className="fila-hilo" onClick={() => abrirPost(c.post_id)}>
                                <div className="icono-hilo"><img src={iconoCorreo} alt="" className="img-icono-hilo" /></div>
                                <div className="cuerpo-hilo">
                                    <h2>{c.post_titulo}</h2>
                                    <p className="meta-hilo">@{c.autor || usuario?.nombre} · {formatFechaRelativa(c.fecha_creacion)} · {c.contenido.substring(0, 60)}{c.contenido.length > 60 ? '...' : ''}</p>
                                </div>
                                <div className="stats-hilo">
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : posts.length === 0 ? (
                <div className="lista-posts">
                    <div className="cabecera-hilos"><span>Hilos</span></div>
                    <div className="tarjeta-vacia">No hay posts aún. Sé el primero en publicar.</div>
                </div>
            ) : (
                <div className="lista-posts">
                    <div className="cabecera-hilos">
                        <span>Hilos</span>
                    </div>
                    {posts.map(post => (
                        <div key={post.id} className="fila-hilo" onClick={() => abrirPost(post.id)}>
                            <div className="icono-hilo"><img src={iconoCorreo} alt="" className="img-icono-hilo" /></div>
                            <div className="cuerpo-hilo">
                                <h2>{post.titulo}</h2>
                                <p className="meta-hilo">@{post.autor} · Actualizado {formatFechaRelativa(post.fecha_creacion)}</p>
                            </div>
                            <div className="stats-hilo">
                                <span className="conteo-hilo">💬 {post.total_comentarios || 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Foro
