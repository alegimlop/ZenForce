import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:3000/api'

function Admin() {
    const [stats, setStats] = useState(null)
    const [usuarios, setUsuarios] = useState([])
    const [clases, setClases] = useState([])
    const [vista, setVista] = useState('dashboard')
    const [formulario, setFormulario] = useState({ nombre: '', email: '', password: '', rol: 'usuario' })
    const [formClase, setFormClase] = useState({ nombre: '', descripcion: '', instructor: '', horario: '', capacidad: 20, fecha: '' })
    const [editando, setEditando] = useState(null)
    const [editandoClase, setEditandoClase] = useState(null)
    const [mensaje, setMensaje] = useState('')

    useEffect(() => {
        cargarStats()
        cargarUsuarios()
        cargarClases()
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

    return (
        <div>
            <h1>Panel de Administración</h1>
            <nav>
                <button onClick={() => setVista('dashboard')}>Dashboard</button>
                <button onClick={() => setVista('usuarios')}>Usuarios</button>
                <button onClick={() => setVista('crear')}>Crear Usuario</button>
                <button onClick={() => setVista('clases')}>Clases</button>
                <button onClick={() => setVista('crear-clase')}>Crear Clase</button>
            </nav>

            {mensaje && <p>{mensaje}</p>}

            {vista === 'dashboard' && stats && (
                <div>
                    <h2>Dashboard</h2>
                    <p>Total usuarios: {stats.total_usuarios}</p>
                    <p>Total admins: {stats.total_admins}</p>
                    <p>Registros hoy: {stats.registros_hoy}</p>
                    <p>Clases activas: {clases.length}</p>
                </div>
            )}

            {vista === 'usuarios' && (
                <div>
                    <h2>Gestión de Usuarios</h2>
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
                        <input type="text" placeholder="Nombre" value={formulario.nombre} onChange={e => setFormulario({ ...formulario, nombre: e.target.value })} />
                        <input type="email" placeholder="Email" value={formulario.email} onChange={e => setFormulario({ ...formulario, email: e.target.value })} />
                        <input type="password" placeholder="Contraseña" value={formulario.password} onChange={e => setFormulario({ ...formulario, password: e.target.value })} />
                        <select value={formulario.rol} onChange={e => setFormulario({ ...formulario, rol: e.target.value })}>
                            <option value="usuario">Usuario</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button type="submit">Crear</button>
                    </form>
                </div>
            )}

            {vista === 'editar' && editando && (
                <div>
                    <h2>Editar Usuario</h2>
                    <form onSubmit={handleUpdate}>
                        <input type="text" value={editando.nombre} onChange={e => setEditando({ ...editando, nombre: e.target.value })} />
                        <input type="email" value={editando.email} onChange={e => setEditando({ ...editando, email: e.target.value })} />
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
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Instructor</th>
                                <th>Horario</th>
                                <th>Capacidad</th>
                                <th>Inscritos</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clases.map(c => (
                                <tr key={c.id}>
                                    <td>{c.nombre}</td>
                                    <td>{c.instructor || '—'}</td>
                                    <td>{c.horario || '—'}</td>
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
                        <input type="text" placeholder="Nombre" value={formClase.nombre} onChange={e => setFormClase({ ...formClase, nombre: e.target.value })} required />
                        <textarea placeholder="Descripción" value={formClase.descripcion} onChange={e => setFormClase({ ...formClase, descripcion: e.target.value })} rows={3} />
                        <input type="text" placeholder="Instructor" value={formClase.instructor} onChange={e => setFormClase({ ...formClase, instructor: e.target.value })} />
                        <input type="text" placeholder="Horario (ej: Lunes y Miércoles 18:00)" value={formClase.horario} onChange={e => setFormClase({ ...formClase, horario: e.target.value })} />
                        <input type="number" placeholder="Capacidad" value={formClase.capacidad} onChange={e => setFormClase({ ...formClase, capacidad: e.target.value })} />
                        <input type="datetime-local" value={formClase.fecha} onChange={e => setFormClase({ ...formClase, fecha: e.target.value })} />
                        <button type="submit">Crear clase</button>
                    </form>
                </div>
            )}

            {vista === 'editar-clase' && editandoClase && (
                <div>
                    <h2>Editar Clase</h2>
                    <form onSubmit={handleUpdateClase}>
                        <input type="text" value={editandoClase.nombre} onChange={e => setEditandoClase({ ...editandoClase, nombre: e.target.value })} required />
                        <textarea value={editandoClase.descripcion || ''} onChange={e => setEditandoClase({ ...editandoClase, descripcion: e.target.value })} rows={3} />
                        <input type="text" value={editandoClase.instructor || ''} onChange={e => setEditandoClase({ ...editandoClase, instructor: e.target.value })} />
                        <input type="text" value={editandoClase.horario || ''} onChange={e => setEditandoClase({ ...editandoClase, horario: e.target.value })} />
                        <input type="number" value={editandoClase.capacidad} onChange={e => setEditandoClase({ ...editandoClase, capacidad: e.target.value })} />
                        <div>
                            <button type="submit">Guardar</button>
                            <button type="button" onClick={() => setVista('clases')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Admin