const db = require('../db')

const getMembresias = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM membresias ORDER BY precio ASC')
        res.json(results)
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const crearMembresia = async (req, res) => {
    const { nombre, precio, duracion_dias, descripcion } = req.body
    try {
        const [result] = await db.query(
            'INSERT INTO membresias (nombre, precio, duracion_dias, descripcion) VALUES (?, ?, ?, ?)',
            [nombre, precio, duracion_dias, descripcion]
        )
        res.status(201).json({ mensaje: 'Membresía creada correctamente', id: result.insertId })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const editarMembresia = async (req, res) => {
    const { id } = req.params
    const { nombre, precio, duracion_dias, descripcion } = req.body
    try {
        await db.query(
            'UPDATE membresias SET nombre = ?, precio = ?, duracion_dias = ?, descripcion = ? WHERE id = ?',
            [nombre, precio, duracion_dias, descripcion, id]
        )
        res.json({ mensaje: 'Membresía actualizada correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const eliminarMembresia = async (req, res) => {
    const { id } = req.params
    try {
        await db.query('DELETE FROM usuario_membresia WHERE id_membresia = ?', [id])
        await db.query('DELETE FROM membresias WHERE id = ?', [id])
        res.json({ mensaje: 'Membresía eliminada correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const getUsuariosMembresia = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT um.id, u.id AS usuario_id, u.nombre, u.email, m.id AS membresia_id, m.nombre AS membresia,
                   um.fecha_inicio, um.fecha_fin, um.activa
            FROM usuario_membresia um
            JOIN usuarios u ON um.id_usuario = u.id
            JOIN membresias m ON um.id_membresia = m.id
            ORDER BY um.fecha_fin DESC
        `)
        res.json(results)
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const asignarMembresia = async (req, res) => {
    const { usuario_id, membresia_id, fecha_inicio, fecha_fin } = req.body
    try {
        await db.query('UPDATE usuario_membresia SET activa = 0 WHERE id_usuario = ?', [usuario_id])
        await db.query(
            'INSERT INTO usuario_membresia (id_usuario, id_membresia, fecha_inicio, fecha_fin, activa) VALUES (?, ?, ?, ?, 1)',
            [usuario_id, membresia_id, fecha_inicio, fecha_fin]
        )
        res.status(201).json({ mensaje: 'Membresía asignada correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const actualizarSuscripcion = async (req, res) => {
    const { id } = req.params
    const { membresia_id, fecha_inicio, fecha_fin } = req.body
    try {
        await db.query(
            'UPDATE usuario_membresia SET id_membresia = ?, fecha_inicio = ?, fecha_fin = ? WHERE id = ?',
            [membresia_id, fecha_inicio, fecha_fin, id]
        )
        res.json({ mensaje: 'Suscripción actualizada correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const quitarSuscripcion = async (req, res) => {
    const { id } = req.params
    try {
        await db.query('DELETE FROM usuario_membresia WHERE id = ?', [id])
        res.json({ mensaje: 'Suscripción eliminada correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

module.exports = { getMembresias, crearMembresia, editarMembresia, eliminarMembresia, getUsuariosMembresia, asignarMembresia, actualizarSuscripcion, quitarSuscripcion }
