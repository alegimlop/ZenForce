const db = require('../db')

const getPosts = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT p.id, p.titulo, p.contenido, p.fecha_creacion,
                   u.nombre AS autor,
                   (SELECT COUNT(*) FROM comentarios WHERE post_id = p.id) AS total_comentarios
            FROM posts p
            JOIN usuarios u ON p.usuario_id = u.id
            ORDER BY p.fecha_creacion DESC
        `)
        res.json(results)
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const getPost = async (req, res) => {
    const { id } = req.params
    try {
        const [posts] = await db.query(`
            SELECT p.id, p.titulo, p.contenido, p.fecha_creacion, p.usuario_id,
                   u.nombre AS autor,
                   (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS total_likes
            FROM posts p
            JOIN usuarios u ON p.usuario_id = u.id
            WHERE p.id = ?
        `, [id])
        if (!posts.length) return res.status(404).json({ error: 'Post no encontrado' })

        const [comentarios] = await db.query(`
            SELECT c.id, c.contenido, c.fecha_creacion, c.usuario_id, u.nombre AS autor
            FROM comentarios c
            JOIN usuarios u ON c.usuario_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.fecha_creacion ASC
        `, [id])
        res.json({ ...posts[0], comentarios })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const crearPost = async (req, res) => {
    const { titulo, contenido, usuario_id } = req.body
    if (!titulo || !contenido || !usuario_id) return res.status(400).json({ error: 'Faltan campos obligatorios' })
    try {
        const [result] = await db.query('INSERT INTO posts (titulo, contenido, usuario_id) VALUES (?, ?, ?)', [titulo, contenido, usuario_id])
        res.status(201).json({ id: result.insertId, mensaje: 'Post creado correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const eliminarPost = async (req, res) => {
    const { id } = req.params
    const { usuario_id } = req.body
    try {
        const [results] = await db.query('SELECT usuario_id FROM posts WHERE id = ?', [id])
        if (!results.length) return res.status(404).json({ error: 'Post no encontrado' })
        if (results[0].usuario_id !== parseInt(usuario_id)) return res.status(403).json({ error: 'No puedes eliminar este post' })

        await db.query('DELETE FROM posts WHERE id = ?', [id])
        res.json({ mensaje: 'Post eliminado correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const editarPost = async (req, res) => {
    const { id } = req.params
    const { titulo, contenido, usuario_id } = req.body
    try {
        const [results] = await db.query('SELECT usuario_id FROM posts WHERE id = ?', [id])
        if (!results.length) return res.status(404).json({ error: 'Post no encontrado' })
        if (results[0].usuario_id !== parseInt(usuario_id)) return res.status(403).json({ error: 'No puedes editar este post' })

        await db.query('UPDATE posts SET titulo = ?, contenido = ? WHERE id = ?', [titulo, contenido, id])
        res.json({ mensaje: 'Post editado correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const añadirComentario = async (req, res) => {
    const { id } = req.params
    const { contenido, usuario_id } = req.body
    if (!contenido || !usuario_id) return res.status(400).json({ error: 'Faltan campos obligatorios' })
    try {
        const [result] = await db.query('INSERT INTO comentarios (post_id, usuario_id, contenido) VALUES (?, ?, ?)', [id, usuario_id, contenido])
        res.status(201).json({ id: result.insertId, mensaje: 'Comentario añadido' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const eliminarComentario = async (req, res) => {
    const { id } = req.params
    const { usuario_id } = req.body
    try {
        const [results] = await db.query('SELECT usuario_id FROM comentarios WHERE id = ?', [id])
        if (!results.length) return res.status(404).json({ error: 'Comentario no encontrado' })
        if (results[0].usuario_id !== parseInt(usuario_id)) return res.status(403).json({ error: 'No puedes eliminar este comentario' })

        await db.query('DELETE FROM comentarios WHERE id = ?', [id])
        res.json({ mensaje: 'Comentario eliminado' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const editarComentario = async (req, res) => {
    const { id } = req.params
    const { contenido, usuario_id } = req.body
    try {
        const [results] = await db.query('SELECT usuario_id FROM comentarios WHERE id = ?', [id])
        if (!results.length) return res.status(404).json({ error: 'Comentario no encontrado' })
        if (results[0].usuario_id !== parseInt(usuario_id)) return res.status(403).json({ error: 'No puedes editar este comentario' })

        await db.query('UPDATE comentarios SET contenido = ? WHERE id = ?', [contenido, id])
        res.json({ mensaje: 'Comentario editado correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const toggleLike = async (req, res) => {
    const { id } = req.params
    const { usuario_id } = req.body
    try {
        const [results] = await db.query('SELECT id FROM likes WHERE post_id = ? AND usuario_id = ?', [id, usuario_id])
        if (results.length > 0) {
            await db.query('DELETE FROM likes WHERE post_id = ? AND usuario_id = ?', [id, usuario_id])
            res.json({ liked: false })
        } else {
            await db.query('INSERT INTO likes (post_id, usuario_id) VALUES (?, ?)', [id, usuario_id])
            res.json({ liked: true })
        }
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const comprobarLike = async (req, res) => {
    const { postId, userId } = req.params
    try {
        const [results] = await db.query('SELECT id FROM likes WHERE post_id = ? AND usuario_id = ?', [postId, userId])
        res.json({ liked: results.length > 0 })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const getPostsAdmin = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT p.id, p.titulo, p.contenido, p.fecha_creacion,
                   u.nombre AS autor,
                   (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS total_likes,
                   (SELECT COUNT(*) FROM comentarios WHERE post_id = p.id) AS total_comentarios
            FROM posts p
            JOIN usuarios u ON p.usuario_id = u.id
            ORDER BY p.fecha_creacion DESC
        `)
        res.json(results)
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const eliminarPostAdmin = async (req, res) => {
    const { id } = req.params
    try {
        await db.query('DELETE FROM comentarios WHERE post_id = ?', [id])
        await db.query('DELETE FROM likes WHERE post_id = ?', [id])
        await db.query('DELETE FROM posts WHERE id = ?', [id])
        res.json({ mensaje: 'Post eliminado correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const getComentariosAdmin = async (req, res) => {
    const { id } = req.params
    try {
        const [results] = await db.query(`
            SELECT c.id, c.contenido, c.fecha_creacion, u.nombre AS autor
            FROM comentarios c
            JOIN usuarios u ON c.usuario_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.fecha_creacion ASC
        `, [id])
        res.json(results)
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const eliminarComentarioAdmin = async (req, res) => {
    const { id } = req.params
    try {
        await db.query('DELETE FROM comentarios WHERE id = ?', [id])
        res.json({ mensaje: 'Comentario eliminado correctamente' })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const getMisPosts = async (req, res) => {
    const { usuarioId } = req.params
    try {
        const [results] = await db.query(`
            SELECT p.id, p.titulo, p.contenido, p.fecha_creacion, u.nombre AS autor
            FROM posts p
            JOIN usuarios u ON p.usuario_id = u.id
            WHERE p.usuario_id = ?
            ORDER BY p.fecha_creacion DESC
        `, [usuarioId])
        res.json(results)
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const getMisLikes = async (req, res) => {
    const { usuarioId } = req.params
    try {
        const [results] = await db.query(`
            SELECT p.id, p.titulo, p.contenido, p.fecha_creacion, u.nombre AS autor
            FROM likes l
            JOIN posts p ON l.post_id = p.id
            JOIN usuarios u ON p.usuario_id = u.id
            WHERE l.usuario_id = ?
            ORDER BY p.fecha_creacion DESC
        `, [usuarioId])
        res.json(results)
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const getMisComentarios = async (req, res) => {
    const { usuarioId } = req.params
    try {
        const [results] = await db.query(`
            SELECT c.id, c.contenido, c.fecha_creacion, p.id AS post_id, p.titulo AS post_titulo
            FROM comentarios c
            JOIN posts p ON c.post_id = p.id
            WHERE c.usuario_id = ?
            ORDER BY c.fecha_creacion DESC
        `, [usuarioId])
        res.json(results)
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

module.exports = { getPosts, crearPost, getPost, eliminarPost, editarPost, añadirComentario, eliminarComentario, editarComentario, toggleLike, comprobarLike, getPostsAdmin, eliminarPostAdmin, getComentariosAdmin, eliminarComentarioAdmin, getMisPosts, getMisLikes, getMisComentarios }
