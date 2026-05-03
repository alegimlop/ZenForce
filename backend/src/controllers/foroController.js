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
    )
}
const getPost = (req, res) => {
    const { id } = req.params;
    db.query(
        `SELECT p.id, p.titulo, p.contenido, p.fecha_creacion, p.usuario_id,
                u.nombre AS autor
         FROM posts p
         JOIN usuarios u ON p.usuario_id = u.id
         WHERE p.id = ?`,
        [id],
        (err, posts) => {
            if (err) return res.status(500).json({ error: 'Error al obtener post' })
            if (posts.length === 0) return res.status(404).json({ error: 'Post no encontrado' })
            res.json(posts[0]);
        }
    )
}
const crearPost = (req, res) => {
    const { titulo, contenido, usuario_id } = req.body;
    if (!titulo || !contenido || !usuario_id)
        return res.status(400).json({ error: 'Faltan campos obligatorios' })

    db.query(
        'INSERT INTO posts (titulo, contenido, usuario_id) VALUES (?, ?, ?)',
        [titulo, contenido, usuario_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al crear post' })
            res.status(201).json({ id: result.insertId, mensaje: 'Post creado correctamente' })
        }
    )
}
const eliminarPost = (req, res) => {
    const { id } = req.params
    const { usuario_id } = req.body

    db.query('SELECT usuario_id FROM posts WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ error: 'Post no encontrado' })
        if (results[0].usuario_id !== parseInt(usuario_id))
            return res.status(403).json({ error: 'No puedes eliminar este post' })

        db.query('DELETE FROM posts WHERE id = ?', [id], (err2) => {
            if (err2) return res.status(500).json({ error: 'Error al eliminar post' })
            res.json({ mensaje: 'Post eliminado correctamente' })
        })
    })
}

module.exports = { getPosts, crearPost, getPost, eliminarPost }