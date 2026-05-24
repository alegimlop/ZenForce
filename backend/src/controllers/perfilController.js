const db = require('../db')
const bcrypt = require('bcrypt')

const getPerfil = async (req, res) => {
    const { id } = req.params
    try {
        const [results] = await db.query(`
            SELECT u.id, u.nombre, u.email, u.rol, u.fecha_registro,
                   m.nombre AS membresia, um.fecha_inicio, um.fecha_fin
            FROM usuarios u
            LEFT JOIN usuario_membresia um ON u.id = um.id_usuario AND um.activa = 1
            LEFT JOIN membresias m ON um.id_membresia = m.id
            WHERE u.id = ?
        `, [id])
        if (!results.length) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json(results[0])
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const updatePerfil = async (req, res) => {
    const { id } = req.params
    const { nombre, email } = req.body
    try {
        await db.query('UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?', [nombre, email, id])
        res.json({ mensaje: 'Perfil actualizado correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const deletePerfil = async (req, res) => {
    const { id } = req.params
    try {
        await db.query('DELETE FROM usuarios WHERE id = ?', [id])
        res.json({ mensaje: 'Cuenta eliminada correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const cambiarPassword = async (req, res) => {
    const { id } = req.params
    const { passwordActual, passwordNueva } = req.body
    try {
        const [results] = await db.query('SELECT password FROM usuarios WHERE id = ?', [id])
        if (!results.length) return res.status(404).json({ error: 'Usuario no encontrado' })

        const passwordValida = await bcrypt.compare(passwordActual, results[0].password)
        if (!passwordValida) return res.status(401).json({ error: 'La contraseña actual es incorrecta' })

        const passwordHash = await bcrypt.hash(passwordNueva, 10)
        await db.query('UPDATE usuarios SET password = ? WHERE id = ?', [passwordHash, id])
        res.json({ mensaje: 'Contraseña cambiada correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const restablecerPassword = async (req, res) => {
    const { email, passwordNueva } = req.body
    try {
        const [results] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email])
        if (!results.length) return res.status(404).json({ error: 'Email no encontrado' })

        const passwordHash = await bcrypt.hash(passwordNueva, 10)
        await db.query('UPDATE usuarios SET password = ? WHERE email = ?', [passwordHash, email])
        res.json({ mensaje: 'Contraseña restablecida correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const cancelarSuscripcion = async (req, res) => {
    const { id } = req.params
    try {
        await db.query('DELETE FROM usuario_membresia WHERE id_usuario = ?', [id])
        res.json({ mensaje: 'Suscripción cancelada correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

module.exports = { getPerfil, updatePerfil, deletePerfil, cambiarPassword, restablecerPassword, cancelarSuscripcion }
