import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/Admin.css'
import API_URL from '../config'
const API = API_URL

function Admin() {
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [usuarios, setUsuarios] = useState([])
    const [clases, setClases] = useState([])
    const [membresias, setMembresias] = useState([])
    const [vista, setVista] = useState('dashboard')
    const [formulario, setFormulario] = useState({ nombre: '', email: '', password: '', rol: 'usuario' })
    const [formClase, setFormClase] = useState({ nombre: '', descripcion: '', instructor: '', hora: '', capacidad: 20, fecha: '', duracion: '' })
    const [formMembresia, setFormMembresia] = useState({ nombre: '', precio: '', duracion_dias: '', descripcion: '' })
    const [editando, setEditando] = useState(null)
    const [editandoClase, setEditandoClase] = useState(null)
    const [editandoMembresia, setEditandoMembresia] = useState(null)
    const [mensaje, setMensaje] = useState('')
    const [suscripciones, setSuscripciones] = useState([])
    const [formAsignar, setFormAsignar] = useState({ usuario_id: '', membresia_id: '', fecha_inicio: '', fecha_fin: '' })
    const [editandoSuscripcion, setEditandoSuscripcion] = useState(null)
    const [posts, setPosts] = useState([])
    const [postSeleccionado, setPostSeleccionado] = useState(null)
    const [comentariosPost, setComentariosPost] = useState([])
    useEffect(() => {
        cargarStats()
        cargarUsuarios()
        cargarClases()
        cargarMembresias()
        cargarSuscripciones()
        cargarPosts()
    }, [])

    const cargarStats = async () => {
        const res = await axios.get(`${API}/admin/stats`)
        setStats(res.data)
    }

    const cargarUsuarios = async () => {
        const res = await axios.get(`${API}/admin/usuarios`)
        setUsuarios(res.data)
    }

    const cargarClases = async () => {
        const res = await axios.get(`${API}/clases`)
        setClases(res.data)
    }

    const cargarMembresias = async () => {
        const res = await axios.get(`${API}/suscripciones`)
        setMembresias(res.data)
    }

    const mostrarMensaje = (texto) => {
        setMensaje(texto)
        setTimeout(() => setMensaje(''), 3000)
    }

    const handleCrear = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${API}/admin/usuarios`, formulario)
            mostrarMensaje('Usuario creado correctamente')
            setFormulario({ nombre: '', email: '', password: '', rol: 'usuario' })
            cargarUsuarios()
            setVista('usuarios')
        } catch {
            mostrarMensaje('Error al crear usuario')
        }
    }

    const handleEditar = (usuario) => {
        setEditando(usuario)
        setVista('editar')
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`${API}/admin/usuarios/${editando.id}`, editando)
            mostrarMensaje('Usuario actualizado correctamente')
            setEditando(null)
            setVista('usuarios')
            cargarUsuarios()
        } catch {
            mostrarMensaje('Error al actualizar usuario')
        }
    }

    const handleEliminar = async (id) => {
        if (!confirm('¿Seguro que quieres eliminar este usuario?')) return
        try {
            await axios.delete(`${API}/admin/usuarios/${id}`)
            mostrarMensaje('Usuario eliminado correctamente')
            cargarUsuarios()
        } catch {
            mostrarMensaje('Error al eliminar usuario')
        }
    }

    const handleCrearClase = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${API}/clases`, formClase)
            mostrarMensaje('Clase creada correctamente')
            setFormClase({ nombre: '', descripcion: '', instructor: '', horario: '', capacidad: 20, fecha: '' })
            cargarClases()
            setVista('clases')
        } catch {
            mostrarMensaje('Error al crear clase')
        }
    }

    const handleUpdateClase = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`${API}/clases/${editandoClase.id}`, editandoClase)
            mostrarMensaje('Clase actualizada correctamente')
            setEditandoClase(null)
            setVista('clases')
            cargarClases()
        } catch {
            mostrarMensaje('Error al actualizar clase')
        }
    }

    const handleEliminarClase = async (id) => {
        if (!confirm('¿Eliminar esta clase?')) return
        try {
            await axios.delete(`${API}/clases/${id}`)
            mostrarMensaje('Clase eliminada correctamente')
            cargarClases()
        } catch {
            mostrarMensaje('Error al eliminar clase')
        }
    }

    const handleCrearMembresia = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${API}/suscripciones`, formMembresia)
            mostrarMensaje('Membresía creada correctamente')
            setFormMembresia({ nombre: '', precio: '', duracion_dias: '', descripcion: '' })
            cargarMembresias()
            setVista('membresias')
        } catch {
            mostrarMensaje('Error al crear membresía')
        }
    }

    const handleUpdateMembresia = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`${API}/suscripciones/${editandoMembresia.id}`, editandoMembresia)
            mostrarMensaje('Membresía actualizada correctamente')
            setEditandoMembresia(null)
            setVista('membresias')
            cargarMembresias()
        } catch {
            mostrarMensaje('Error al actualizar membresía')
        }
    }

    const handleEliminarMembresia = async (id) => {
        if (!confirm('¿Eliminar esta membresía?')) return
        try {
            await axios.delete(`${API}/suscripciones/${id}`)
            mostrarMensaje('Membresía eliminada correctamente')
            cargarMembresias()
            cargarSuscripciones()
        } catch {
            mostrarMensaje('Error al eliminar membresía')
        }
    }
    const cargarSuscripciones = async () => {
        const res = await axios.get(`${API}/suscripciones/usuarios`)
        setSuscripciones(res.data)
    }
    const handleAsignarMembresia = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${API}/suscripciones/asignar`, formAsignar)
            mostrarMensaje('Membresía asignada correctamente')
            setFormAsignar({ usuario_id: '', membresia_id: '', fecha_inicio: '', fecha_fin: '' })
            cargarSuscripciones()
            setVista('suscripciones')
        } catch {
            mostrarMensaje('Error al asignar membresía')
        }
    }
    const handleQuitarSuscripcion = async (id) => {
        if (!confirm('¿Quitar esta membresía al usuario?')) return
        try {
            await axios.delete(`${API}/suscripciones/usuarios/${id}`)
            mostrarMensaje('Membresía quitada correctamente')
            cargarSuscripciones()
        } catch {
            mostrarMensaje('Error al quitar membresía')
        }
    }

    const handleUpdateSuscripcion = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`${API}/suscripciones/usuarios/${editandoSuscripcion.id}`, {
                membresia_id: editandoSuscripcion.membresia_id,
                fecha_inicio: editandoSuscripcion.fecha_inicio,
                fecha_fin: editandoSuscripcion.fecha_fin
            })
            mostrarMensaje('Suscripción actualizada correctamente')
            setEditandoSuscripcion(null)
            setVista('suscripciones')
            cargarSuscripciones()
        } catch {
            mostrarMensaje('Error al actualizar suscripción')
        }

    }
    const cargarPosts = async () => {
        const res = await axios.get(`${API}/foro/admin/posts`)
        setPosts(res.data)
    }
    const handleEliminarPost = async (id) => {
        if (!confirm('¿Eliminar este post y sus comentarios?')) return
        try {
            await axios.delete(`${API}/foro/admin/posts/${id}`)
            mostrarMensaje('Post eliminado correctamente')
            cargarPosts()
        } catch {
            mostrarMensaje('Error al eliminar post')
        }
    }
    const verComentarios = async (post) => {
        const res = await axios.get(`${API}/foro/admin/posts/${post.id}/comentarios`)
        setComentariosPost(res.data)
        setPostSeleccionado(post)
        setVista('comentarios-post')
    }

    const handleEliminarComentarioAdmin = async (id) => {
        if (!confirm('¿Eliminar este comentario?')) return
        try {
            await axios.delete(`${API}/foro/admin/comentarios/${id}`)
            mostrarMensaje('Comentario eliminado correctamente')
            const res = await axios.get(`${API}/foro/admin/posts/${postSeleccionado.id}/comentarios`)
            setComentariosPost(res.data)
        } catch {
            mostrarMensaje('Error al eliminar comentario')
        }
    }
    const seccionesNav = [
        { id: 'dashboard', label: 'Vista General' },
        { id: 'usuarios', label: 'Usuarios' },
        { id: 'clases', label: 'Clases' },
        { id: 'foro', label: 'Foro' },
        { id: 'membresias', label: 'Membresías' },
        { id: 'suscripciones', label: 'Suscripciones' },
    ]

    return (
        <div className="panel-admin">
            <aside className="sidebar-admin">
                <h1 className="titulo-admin">ADMIN</h1>
                <nav className="nav-admin">
                    <button className="boton-salir-admin" onClick={() => navigate('/')}>
                        ← Volver al sitio
                    </button>
                    {seccionesNav.map(s => (
                        <button
                            key={s.id}
                            className={`boton-nav-admin ${vista === s.id || vista.startsWith(s.id + '-') || (s.id === 'usuarios' && ['crear','editar'].includes(vista)) ? 'activo' : ''}`}
                            onClick={() => setVista(s.id)}
                        >
                            {s.label}
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="contenido-admin">
                {mensaje && <p className="mensaje-admin">{mensaje}</p>}

            {vista === 'dashboard' && stats && (
                <div>
                    <h2>Vista General</h2>
                    <div className="cuadricula-stats">
                        <div className="tarjeta-stat">
                            <span className="numero-stat">{stats.total_usuarios}</span>
                            <span className="etiqueta-stat">Usuarios totales</span>
                        </div>
                        <div className="tarjeta-stat">
                            <span className="numero-stat">{stats.total_admins}</span>
                            <span className="etiqueta-stat">Administradores</span>
                        </div>
                        <div className="tarjeta-stat destacada">
                            <span className="numero-stat">{stats.registros_hoy}</span>
                            <span className="etiqueta-stat">Registros hoy</span>
                        </div>
                        <div className="tarjeta-stat">
                            <span className="numero-stat">{clases.length}</span>
                            <span className="etiqueta-stat">Clases activas</span>
                        </div>
                        <div className="tarjeta-stat">
                            <span className="numero-stat">{membresias.length}</span>
                            <span className="etiqueta-stat">Planes disponibles</span>
                        </div>
                        <div className="tarjeta-stat">
                            <span className="numero-stat">{suscripciones.length}</span>
                            <span className="etiqueta-stat">Suscripciones activas</span>
                        </div>
                    </div>
                </div>
            )}

            {vista === 'usuarios' && (
                <div>
                    <h2>Gestión de Usuarios</h2>
                    <button className="boton-accion-admin" onClick={() => setVista('crear')}>+ Crear Usuario</button>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Fecha Registro</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.nombre}</td>
                                    <td>{u.email}</td>
                                    <td>{u.rol}</td>
                                    <td>{new Date(u.fecha_registro).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => handleEditar(u)}>Editar</button>
                                        <button onClick={() => handleEliminar(u.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {vista === 'crear' && (
                <div>
                    <h2>Crear Usuario</h2>
                    <form onSubmit={handleCrear}>
                        <label>Nombre</label>
                        <input type="text" value={formulario.nombre} onChange={e => setFormulario({ ...formulario, nombre: e.target.value })} required />
                        <label>Email</label>
                        <input type="email" value={formulario.email} onChange={e => setFormulario({ ...formulario, email: e.target.value })} required />
                        <label>Contraseña</label>
                        <input type="password" value={formulario.password} onChange={e => setFormulario({ ...formulario, password: e.target.value })} required />
                        <label>Rol</label>
                        <select value={formulario.rol} onChange={e => setFormulario({ ...formulario, rol: e.target.value })}>
                            <option value="usuario">Usuario</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div>
                            <button type="submit">Crear</button>
                            <button type="button" onClick={() => setVista('usuarios')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            {vista === 'editar' && editando && (
                <div>
                    <h2>Editar Usuario</h2>
                    <form onSubmit={handleUpdate}>
                        <label>Nombre</label>
                        <input type="text" value={editando.nombre} onChange={e => setEditando({ ...editando, nombre: e.target.value })} required />
                        <label>Email</label>
                        <input type="email" value={editando.email} onChange={e => setEditando({ ...editando, email: e.target.value })} required />
                        <label>Rol</label>
                        <select value={editando.rol} onChange={e => setEditando({ ...editando, rol: e.target.value })}>
                            <option value="usuario">Usuario</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div>
                            <button type="submit">Guardar</button>
                            <button type="button" onClick={() => setVista('usuarios')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            {vista === 'clases' && (
                <div>
                    <h2>Gestión de Clases</h2>
                    <button className="boton-accion-admin" onClick={() => setVista('crear-clase')}>+ Crear Clase</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripcion</th>
                                <th>Instructor</th>
                                <th>Hora</th>
                                <th>Fecha</th>
                                <th>Capacidad</th>
                                <th>Inscritos</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clases.map(c => (
                                <tr key={c.id}>
                                    <td>{c.nombre}</td>
                                    <td>{c.descripcion || '—'}</td>
                                    <td>{c.instructor || '—'}</td>
                                    <td>{c.hora || '—'}</td>
                                    <td>{c.fecha ? new Date(c.fecha).toLocaleDateString() : '—'}</td>
                                    <td>{c.capacidad}</td>
                                    <td>{c.inscritos}</td>
                                    <td>
                                        <button onClick={() => { setEditandoClase(c); setVista('editar-clase') }}>Editar</button>
                                        <button onClick={() => handleEliminarClase(c.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {vista === 'crear-clase' && (
                <div>
                    <h2>Crear Clase</h2>
                    <form onSubmit={handleCrearClase}>
                        <label>Nombre</label>
                        <input type="text" value={formClase.nombre} onChange={e => setFormClase({ ...formClase, nombre: e.target.value })} required />
                        <label>Descripción</label>
                        <textarea value={formClase.descripcion} onChange={e => setFormClase({ ...formClase, descripcion: e.target.value })} rows={3} />
                        <label>Instructor</label>
                        <select value={formClase.instructor} onChange={e => setFormClase({ ...formClase, instructor: e.target.value })} required>
                            <option value="">Selecciona un instructor</option>
                            {usuarios.filter(u => u.rol === 'admin').map(u => (
                                <option key={u.id} value={u.nombre}>{u.nombre}</option>
                            ))}
                        </select>
                        <label>Hora</label>
                        <input type="time" value={formClase.hora} onChange={e => setFormClase({ ...formClase, hora: e.target.value })} />
                        <label>Capacidad</label>
                        <input type="number" value={formClase.capacidad} onChange={e => setFormClase({ ...formClase, capacidad: e.target.value })} />
                        <label>Duración (minutos)</label>
                        <input type="number" value={formClase.duracion} onChange={e => setFormClase({ ...formClase, duracion: e.target.value })} required />
                        <label>Fecha</label>
                        <input type="date" value={formClase.fecha} onChange={e => setFormClase({ ...formClase, fecha: e.target.value })} />
                        <div>
                            <button type="submit">Crear clase</button>
                            <button type="button" onClick={() => setVista('clases')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            {vista === 'editar-clase' && editandoClase && (
                <div>
                    <h2>Editar Clase</h2>
                    <form onSubmit={handleUpdateClase}>
                        <label>Nombre</label>
                        <input type="text" value={editandoClase.nombre} onChange={e => setEditandoClase({ ...editandoClase, nombre: e.target.value })} required />
                        <label>Descripción</label>
                        <textarea value={editandoClase.descripcion || ''} onChange={e => setEditandoClase({ ...editandoClase, descripcion: e.target.value })} rows={3} />
                        <label>Instructor</label>
                        <select value={editandoClase.instructor || ''} onChange={e => setEditandoClase({ ...editandoClase, instructor: e.target.value })}>
                            <option value="">Selecciona un instructor</option>
                            {usuarios.filter(u => u.rol === 'admin').map(u => (
                                <option key={u.id} value={u.nombre}>{u.nombre}</option>
                            ))}
                        </select>
                        <label>Hora</label>
                        <input type="time" value={editandoClase.hora || ''} onChange={e => setEditandoClase({ ...editandoClase, hora: e.target.value })} />
                        <label>Capacidad</label>
                        <input type="number" value={editandoClase.capacidad} onChange={e => setEditandoClase({ ...editandoClase, capacidad: e.target.value })} />
                        <label>Duración (minutos)</label>
                        <input type="number" value={editandoClase.duracion || ''} onChange={e => setEditandoClase({ ...editandoClase, duracion: e.target.value })} required />
                        <label>Fecha</label>
                        <input type="date" value={editandoClase.fecha ? new Date(editandoClase.fecha).toISOString().split('T')[0] : ''} onChange={e => setEditandoClase({ ...editandoClase, fecha: e.target.value })} />
                        <div>
                            <button type="submit">Guardar</button>
                            <button type="button" onClick={() => setVista('clases')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            {vista === 'membresias' && (
                <div>
                    <h2>Gestión de Membresías</h2>
                    <button className="boton-accion-admin" onClick={() => setVista('crear-membresia')}>+ Crear Membresía</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Duración</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {membresias.map(m => (
                                <tr key={m.id}>
                                    <td>{m.nombre}</td>
                                    <td>{m.precio}€</td>
                                    <td>{m.duracion_dias} días</td>
                                    <td>{m.descripcion || '—'}</td>
                                    <td>
                                        <button onClick={() => { setEditandoMembresia(m); setVista('editar-membresia') }}>Editar</button>
                                        <button onClick={() => handleEliminarMembresia(m.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {vista === 'crear-membresia' && (
                <div>
                    <h2>Crear Membresía</h2>
                    <form onSubmit={handleCrearMembresia}>
                        <label>Nombre</label>
                        <input type="text" value={formMembresia.nombre} onChange={e => setFormMembresia({ ...formMembresia, nombre: e.target.value })} required />
                        <label>Precio (€)</label>
                        <input type="number" value={formMembresia.precio} onChange={e => setFormMembresia({ ...formMembresia, precio: e.target.value })} required />
                        <label>Duración en días</label>
                        <input type="number" value={formMembresia.duracion_dias} onChange={e => setFormMembresia({ ...formMembresia, duracion_dias: e.target.value })} required />
                        <label>Descripción</label>
                        <textarea value={formMembresia.descripcion} onChange={e => setFormMembresia({ ...formMembresia, descripcion: e.target.value })} rows={3} />
                        <div>
                            <button type="submit">Crear membresía</button>
                            <button type="button" onClick={() => setVista('membresias')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            {vista === 'editar-membresia' && editandoMembresia && (
                <div>
                    <h2>Editar Membresía</h2>
                    <form onSubmit={handleUpdateMembresia}>
                        <label>Nombre</label>
                        <input type="text" value={editandoMembresia.nombre} onChange={e => setEditandoMembresia({ ...editandoMembresia, nombre: e.target.value })} required />
                        <label>Precio (€)</label>
                        <input type="number" value={editandoMembresia.precio} onChange={e => setEditandoMembresia({ ...editandoMembresia, precio: e.target.value })} required />
                        <label>Duración en días</label>
                        <input type="number" value={editandoMembresia.duracion_dias} onChange={e => setEditandoMembresia({ ...editandoMembresia, duracion_dias: e.target.value })} required />
                        <label>Descripción</label>
                        <textarea value={editandoMembresia.descripcion || ''} onChange={e => setEditandoMembresia({ ...editandoMembresia, descripcion: e.target.value })} rows={3} />
                        <div>
                            <button type="submit">Guardar</button>
                            <button type="button" onClick={() => setVista('membresias')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            {vista === 'suscripciones' && (
                <div>
                    <h2>Suscripciones</h2>
                    <button className="boton-accion-admin" onClick={() => setVista('asignar-membresia')}>+ Asignar Membresía</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Membresía</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suscripciones.map((s, i) => (
                                <tr key={i}>
                                    <td>{s.nombre}</td>
                                    <td>{s.email}</td>
                                    <td>{s.membresia}</td>
                                    <td>{new Date(s.fecha_inicio).toLocaleDateString()}</td>
                                    <td>{new Date(s.fecha_fin).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => { setEditandoSuscripcion(s); setVista('editar-suscripcion') }}>Editar</button>
                                        <button onClick={() => handleQuitarSuscripcion(s.id)}>Quitar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {vista === 'asignar-membresia' && (
                <div>
                    <h2>Asignar Membresía</h2>
                    <form onSubmit={handleAsignarMembresia}>
                        <label>Usuario</label>
                        <select value={formAsignar.usuario_id} onChange={e => setFormAsignar({ ...formAsignar, usuario_id: e.target.value })} required>
                            <option value="">Selecciona un usuario</option>
                            {usuarios.map(u => (
                                <option key={u.id} value={u.id}>{u.nombre} ({u.email})</option>
                            ))}
                        </select>
                        <label>Membresía</label>
                        <select value={formAsignar.membresia_id} onChange={e => setFormAsignar({ ...formAsignar, membresia_id: e.target.value })} required>
                            <option value="">Selecciona una membresía</option>
                            {membresias.map(m => (
                                <option key={m.id} value={m.id}>{m.nombre} - {m.precio}€</option>
                            ))}
                        </select>
                        <label>Fecha inicio</label>
                        <input type="date" value={formAsignar.fecha_inicio} onChange={e => setFormAsignar({ ...formAsignar, fecha_inicio: e.target.value })} required />
                        <label>Fecha fin</label>
                        <input type="date" value={formAsignar.fecha_fin} onChange={e => setFormAsignar({ ...formAsignar, fecha_fin: e.target.value })} required />
                        <div>
                            <button type="submit">Asignar</button>
                            <button type="button" onClick={() => setVista('suscripciones')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            {vista === 'editar-suscripcion' && editandoSuscripcion && (
                <div>
                    <h2>Editar Suscripción de {editandoSuscripcion.nombre}</h2>
                    <form onSubmit={handleUpdateSuscripcion}>
                        <label>Membresía</label>
                        <select value={editandoSuscripcion.membresia_id} onChange={e => setEditandoSuscripcion({ ...editandoSuscripcion, membresia_id: e.target.value })} required>
                            {membresias.map(m => (
                                <option key={m.id} value={m.id}>{m.nombre} - {m.precio}€</option>
                            ))}
                        </select>
                        <label>Fecha inicio</label>
                        <input type="date" value={editandoSuscripcion.fecha_inicio?.split('T')[0]} onChange={e => setEditandoSuscripcion({ ...editandoSuscripcion, fecha_inicio: e.target.value })} required />
                        <label>Fecha fin</label>
                        <input type="date" value={editandoSuscripcion.fecha_fin?.split('T')[0]} onChange={e => setEditandoSuscripcion({ ...editandoSuscripcion, fecha_fin: e.target.value })} required />
                        <div>
                            <button type="submit">Guardar</button>
                            <button type="button" onClick={() => setVista('suscripciones')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}
            {vista === 'foro' && (
                <div>
                    <h2>Gestión del Foro</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Titulo</th>
                                <th>Autor</th>
                                <th>Fecha</th>
                                <th>Likes</th>
                                <th>Comentarios</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(p => (
                                <tr key={p.id}>
                                    <td>{p.titulo}</td>
                                    <td>{p.autor}</td>
                                    <td>{new Date(p.fecha_creacion).toLocaleDateString()}</td>
                                    <td>{p.total_likes}</td>
                                    <td>{p.total_comentarios}</td>
                                    <td>
                                        <button onClick={() => verComentarios(p)}>Comentarios</button>
                                        <button onClick={() => handleEliminarPost(p.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {vista === 'comentarios-post' && postSeleccionado && (
                <div>
                    <h2>Comentarios de: {postSeleccionado.titulo}</h2>
                    <button onClick={() => setVista('foro')}>Volver</button>
                    {comentariosPost.length === 0 ? (
                        <p>No hay comentarios en este post.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Autor</th>
                                    <th>Contenido</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comentariosPost.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.autor}</td>
                                        <td>{c.contenido}</td>
                                        <td>{new Date(c.fecha_creacion).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => handleEliminarComentarioAdmin(c.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
            </main>
        </div>
    )
}

export default Admin