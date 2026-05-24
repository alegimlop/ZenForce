const db = require('../db')
const bcrypt = require('bcrypt')

const getUsuarios = async (req, res) => {
    try {
        const [results] = await db.query('SELECT id, nombre, email, rol, fecha_registro FROM usuarios')
        res.json(results)
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const createUsuario = async (req, res) => {
    const { nombre, email, password, rol } = req.body
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        await db.query('INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)', [nombre, email, passwordHash, rol || 'usuario'])
        res.status(201).json({ mensaje: 'Usuario creado correctamente' })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'El email ya existe' })
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const updateUsuario = async (req, res) => {
    const { id } = req.params
    const { nombre, email, rol } = req.body
    try {
        await db.query('UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?', [nombre, email, rol, id])
        res.json({ mensaje: 'Usuario actualizado correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const deleteUsuario = async (req, res) => {
    const { id } = req.params
    try {
        await db.query('DELETE FROM usuarios WHERE id = ?', [id])
        res.json({ mensaje: 'Usuario eliminado correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const getStats = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT
                (SELECT COUNT(*) FROM usuarios) AS total_usuarios,
                (SELECT COUNT(*) FROM usuarios WHERE rol = 'admin') AS total_admins,
                (SELECT COUNT(*) FROM usuarios WHERE DATE(fecha_registro) = CURDATE()) AS registros_hoy
        `)
        res.json(results[0])
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

module.exports = { getUsuarios, createUsuario, updateUsuario, deleteUsuario, getStats }
