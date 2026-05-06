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

module.exports = { getMembresias, crearMembresia, editarMembresia, eliminarMembresia }