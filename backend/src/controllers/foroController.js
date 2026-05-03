const db = require('../db');

const getPosts = (req, res) => {
    db.query(
        `SELECT p.id, p.titulo, p.contenido, p.fecha_creacion,
                u.nombre AS autor
         FROM posts p
         JOIN usuarios u ON p.usuario_id = u.id
         ORDER BY p.fecha_creacion DESC`,
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener posts' });
            res.json(results);
        }
    );
};

module.exports = { getPosts };