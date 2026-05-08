const db = require('../db')

const getMembresias = (req, res) => {
    db.query('SELECT * FROM membresias ORDER BY precio ASC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener membresías' })
        res.json(results)
    })
}

const crearMembresia = (req, res) => {
    const { nombre, precio, duracion_dias, descripcion } = req.body
    db.query(
        'INSERT INTO membresias (nombre, precio, duracion_dias, descripcion) VALUES (?, ?, ?, ?)',
        [nombre, precio, duracion_dias, descripcion],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al crear membresía' })
            res.status(201).json({ mensaje: 'Membresía creada correctamente', id: result.insertId })
        }
    )
}

const editarMembresia = (req, res) => {
    const { id } = req.params
    const { nombre, precio, duracion_dias, descripcion } = req.body
    db.query(
        'UPDATE membresias SET nombre = ?, precio = ?, duracion_dias = ?, descripcion = ? WHERE id = ?',
        [nombre, precio, duracion_dias, descripcion, id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al editar membresía' })
            res.json({ mensaje: 'Membresía actualizada correctamente' })
        }
    )
}

const eliminarMembresia = (req, res) => {
    const { id } = req.params
    db.query('DELETE FROM membresias WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar membresía' })
        res.json({ mensaje: 'Membresía eliminada correctamente' })
    })
}
const getUsuariosMembresia = (req, res) => {
    db.query(
        `SELECT um.id, u.id AS usuario_id, u.nombre, u.email, m.id AS membresia_id, m.nombre AS membresia, 
         um.fecha_inicio, um.fecha_fin, um.activa
         FROM usuario_membresia um
         JOIN usuarios u ON um.id_usuario = u.id
         JOIN membresias m ON um.id_membresia = m.id
         ORDER BY um.fecha_fin DESC`,
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener suscripciones' })
            res.json(results)
        }
    )
}

const asignarMembresia = (req, res) => {
    const { usuario_id, membresia_id, fecha_inicio, fecha_fin } = req.body

    db.query(
        'UPDATE usuario_membresia SET activa = 0 WHERE id_usuario = ?',
        [usuario_id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al desactivar membresía anterior' })

            db.query(
                'INSERT INTO usuario_membresia (id_usuario, id_membresia, fecha_inicio, fecha_fin, activa) VALUES (?, ?, ?, ?, 1)',
                [usuario_id, membresia_id, fecha_inicio, fecha_fin],
                (err2) => {
                    if (err2) return res.status(500).json({ error: 'Error al asignar membresía' })
                    res.status(201).json({ mensaje: 'Membresía asignada correctamente' })
                }
            )
        }
    )
}
const actualizarSuscripcion = (req, res) => {
    const { id } = req.params
    const { membresia_id, fecha_inicio, fecha_fin } = req.body

    db.query(
        'UPDATE usuario_membresia SET id_membresia = ?, fecha_inicio = ?, fecha_fin = ? WHERE id = ?',
        [membresia_id, fecha_inicio, fecha_fin, id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar suscripción' })
            res.json({ mensaje: 'Suscripción actualizada correctamente' })
        }
    )
}

const quitarSuscripcion = (req, res) => {
    const { id } = req.params
    db.query(
        'DELETE FROM usuario_membresia WHERE id = ?',
        [id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al quitar suscripción' })
            res.json({ mensaje: 'Suscripción eliminada correctamente' })
        }
    )
}

module.exports = { getMembresias, crearMembresia, editarMembresia, eliminarMembresia, getUsuariosMembresia, asignarMembresia, actualizarSuscripcion, quitarSuscripcion }