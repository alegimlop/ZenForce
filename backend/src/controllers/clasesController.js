const db = require('../db')

const getClases = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT c.*, COUNT(i.usuario_id) AS inscritos
            FROM clases c
            LEFT JOIN inscripciones_clases i ON c.id = i.clase_id
            GROUP BY c.id
            ORDER BY c.fecha ASC
        `)
        res.json(results)
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const getMisClases = async (req, res) => {
    const { usuarioId } = req.params
    try {
        const [results] = await db.query('SELECT clase_id AS id FROM inscripciones_clases WHERE usuario_id = ?', [usuarioId])
        res.json(results)
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const inscribirse = async (req, res) => {
    const { claseId } = req.params
    const { usuario_id } = req.body
    try {
        const [results] = await db.query(`
            SELECT c.capacidad, COUNT(i.usuario_id) AS inscritos
            FROM clases c
            LEFT JOIN inscripciones_clases i ON c.id = i.clase_id
            WHERE c.id = ?
            GROUP BY c.id
        `, [claseId])
        if (!results.length) return res.status(404).json({ error: 'Clase no encontrada' })
        if (results[0].inscritos >= results[0].capacidad) return res.status(400).json({ error: 'La clase está completa' })

        await db.query('INSERT INTO inscripciones_clases (usuario_id, clase_id) VALUES (?, ?)', [usuario_id, claseId])
        res.status(201).json({ mensaje: 'Inscripción realizada correctamente' })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Ya estás inscrito en esta clase' })
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const cancelarInscripcion = async (req, res) => {
    const { claseId } = req.params
    const { usuario_id } = req.body
    try {
        await db.query('DELETE FROM inscripciones_clases WHERE usuario_id = ? AND clase_id = ?', [usuario_id, claseId])
        res.json({ mensaje: 'Inscripción cancelada' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const crearClase = async (req, res) => {
    const { nombre, descripcion, instructor, hora, fecha, capacidad, duracion } = req.body
    try {
        const [result] = await db.query(
            'INSERT INTO clases (nombre, descripcion, instructor, hora, fecha, capacidad, duracion) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, instructor, hora, fecha, capacidad, duracion]
        )
        res.status(201).json({ mensaje: 'Clase creada correctamente', id: result.insertId })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const editarClase = async (req, res) => {
    const { id } = req.params
    const { nombre, descripcion, instructor, hora, fecha, capacidad, duracion } = req.body
    const fechaFormateada = fecha ? fecha.split('T')[0] : null
    try {
        await db.query(
            'UPDATE clases SET nombre=?, descripcion=?, instructor=?, hora=?, fecha=?, capacidad=?, duracion=? WHERE id=?',
            [nombre, descripcion, instructor, hora, fechaFormateada, capacidad, duracion, id]
        )
        res.json({ mensaje: 'Clase actualizada correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const eliminarClase = async (req, res) => {
    const { id } = req.params
    try {
        await db.query('DELETE FROM clases WHERE id = ?', [id])
        res.json({ mensaje: 'Clase eliminada correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

module.exports = { getClases, getMisClases, inscribirse, cancelarInscripcion, crearClase, editarClase, eliminarClase }
