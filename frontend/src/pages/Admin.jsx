import { useState, useEffect } from 'react'
import axios from 'axios'

function Admin() {
    const [stats, setStats] = useState(null)
    const [usuarios, setUsuarios] = useState([])
    const [vista, setVista] = useState('dashboard')
    const [formulario, setFormulario] = useState({ nombre: '', email: '', password: '', rol: 'usuario' })
    const [editando, setEditando] = useState(null)
    const [mensaje, setMensaje] = useState('')

    useEffect(() => {
        cargarStats()
        cargarUsuarios()
    }, [])

    const cargarStats = async () => {
        const res = await axios.get('http://localhost:3000/api/admin/stats')
        setStats(res.data)
    }

    const cargarUsuarios = async () => {
        const res = await axios.get('http://localhost:3000/api/admin/usuarios')
        setUsuarios(res.data)
    }

    const handleCrear = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:3000/api/admin/usuarios', formulario)
            setMensaje('Usuario creado correctamente')
            setFormulario({ nombre: '', email: '', password: '', rol: 'usuario' })
            cargarUsuarios()
        } catch (err) {
            setMensaje('Error al crear usuario')
        }
    }

    const handleEditar = (usuario) => {
        setEditando(usuario)
        setVista('editar')
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`http://localhost:3000/api/admin/usuarios/${editando.id}`, editando)
            setMensaje('Usuario actualizado correctamente')
            setEditando(null)
            setVista('usuarios')
            cargarUsuarios()
        } catch (err) {
            setMensaje('Error al actualizar usuario')
        }
    }

    const handleEliminar = async (id) => {
        if (!confirm('¿Seguro que quieres eliminar este usuario?')) return
        try {
            await axios.delete(`http://localhost:3000/api/admin/usuarios/${id}`)
            setMensaje('Usuario eliminado correctamente')
            cargarUsuarios()
        } catch (err) {
            setMensaje('Error al eliminar usuario')
        }
    }

    return (
        <div>
            <h1>Panel de Administración</h1>
            <nav>
                <button onClick={() => setVista('dashboard')}>Dashboard</button>
                <button onClick={() => setVista('usuarios')}>Usuarios</button>
                <button onClick={() => setVista('crear')}>Crear Usuario</button>
            </nav>

            {mensaje && <p>{mensaje}</p>}

            {vista === 'dashboard' && stats && (
                <div>
                    <h2>Dashboard</h2>
                    <p>Total usuarios: {stats.total_usuarios}</p>
                    <p>Total admins: {stats.total_admins}</p>
                    <p>Registros hoy: {stats.registros_hoy}</p>
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
                        <button type="submit">Guardar</button>
                        <button onClick={() => setVista('usuarios')}>Cancelar</button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Admin