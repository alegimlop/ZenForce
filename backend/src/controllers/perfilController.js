const db = require('../db');

const getPerfil = (req, res) => {
    const id = req.params.id;

    db.query(
        `SELECT u.id, u.nombre, u.email, u.rol, u.fecha_registro, 
        m.nombre AS membresia, um.fecha_inicio, um.fecha_fin
        FROM usuarios u
        LEFT JOIN usuario_membresia um ON u.id = um.id_usuario AND um.activa = 1
        LEFT JOIN membresias m ON um.id_membresia = m.id
        WHERE u.id = ?`,
        [id],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener perfil' });
            if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
            res.json(results[0]);
        }
    );
};

const updatePerfil = (req, res) => {
    const id = req.params.id;
    const { nombre, email } = req.body;

    db.query(
        'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
        [nombre, email, id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar perfil' });
            res.json({ mensaje: 'Perfil actualizado correctamente' });
        }
    );
};

module.exports = { getPerfil, updatePerfil };