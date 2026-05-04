const db = require('../db');

const getClases = (req, res) => {
    db.query(
        `SELECT c.*, COUNT(i.usuario_id) AS inscritos
         FROM clases c
         LEFT JOIN inscripciones_clases i ON c.id = i.clase_id
         GROUP BY c.id
         ORDER BY c.fecha ASC`,
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener clases' });
            res.json(results);
        }
    );
};

const getMisClases = (req, res) => {
    const { usuarioId } = req.params;
    db.query(
        'SELECT clase_id AS id FROM inscripciones_clases WHERE usuario_id = ?',
        [usuarioId],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener tus clases' });
            res.json(results);
        }
    );
};

const inscribirse = (req, res) => {
    const { claseId } = req.params;
    const { usuario_id } = req.body;

    db.query(
        `SELECT c.capacidad, COUNT(i.usuario_id) AS inscritos
         FROM clases c
         LEFT JOIN inscripciones_clases i ON c.id = i.clase_id
         WHERE c.id = ?
         GROUP BY c.id`,
        [claseId],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al comprobar la clase' });
            if (!results.length) return res.status(404).json({ error: 'Clase no encontrada' });

            const { capacidad, inscritos } = results[0];
            if (inscritos >= capacidad) return res.status(400).json({ error: 'La clase está completa' });

            db.query(
                'INSERT INTO inscripciones_clases (usuario_id, clase_id) VALUES (?, ?)',
                [usuario_id, claseId],
                (err) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY')
                            return res.status(400).json({ error: 'Ya estás inscrito en esta clase' });
                        return res.status(500).json({ error: 'Error al inscribirse' });
                    }
                    res.status(201).json({ mensaje: 'Inscripción realizada correctamente' });
                }
            );
        }
    );
};

const cancelarInscripcion = (req, res) => {
    const { claseId } = req.params;
    const { usuario_id } = req.body;
    db.query(
        'DELETE FROM inscripciones_clases WHERE usuario_id = ? AND clase_id = ?',
        [usuario_id, claseId],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al cancelar inscripción' });
            res.json({ mensaje: 'Inscripción cancelada' });
        }
    );
};

const crearClase = (req, res) => {
    const { nombre, descripcion, instructor, horario, fecha, capacidad } = req.body;
    db.query(
        'INSERT INTO clases (nombre, descripcion, instructor, horario, fecha, capacidad) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, instructor, horario, fecha, capacidad],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al crear la clase' });
            res.status(201).json({ mensaje: 'Clase creada correctamente', id: result.insertId });
        }
    );
};

const editarClase = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, instructor, horario, fecha, capacidad } = req.body;
    db.query(
        'UPDATE clases SET nombre=?, descripcion=?, instructor=?, horario=?, fecha=?, capacidad=? WHERE id=?',
        [nombre, descripcion, instructor, horario, fecha, capacidad, id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al editar la clase' });
            res.json({ mensaje: 'Clase actualizada correctamente' });
        }
    );
};

const eliminarClase = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM clases WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar la clase' });
        res.json({ mensaje: 'Clase eliminada correctamente' });
    });
};

module.exports = { getClases, getMisClases, inscribirse, cancelarInscripcion, crearClase, editarClase, eliminarClase };
