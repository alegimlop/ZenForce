const db = require('../db');
const bcrypt = require('bcrypt');

const getUsuarios = (req, res) => {
    db.query(
        'SELECT id, nombre, email, rol, fecha_registro FROM usuarios',
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
            res.json(results);
        }
    );
};

const createUsuario = async (req, res) => {
    const { nombre, email, password, rol } = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        db.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, passwordHash, rol || 'usuario'],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY')
                        return res.status(400).json({ error: 'El email ya existe' });
                    return res.status(500).json({ error: 'Error al crear usuario' });
                }
                res.status(201).json({ mensaje: 'Usuario creado correctamente' });
            }
        );
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Editar usuario
const updateUsuario = (req, res) => {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;
    db.query(
        'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?',
        [nombre, email, rol, id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar usuario' });
            res.json({ mensaje: 'Usuario actualizado correctamente' });
        }
    );
};

const deleteUsuario = (req, res) => {
    const { id } = req.params

    db.query('DELETE FROM likes WHERE usuario_id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar likes' })

        db.query('DELETE FROM foro_comentarios WHERE id_usuario = ?', [id], (err2) => {
            if (err2) return res.status(500).json({ error: 'Error al eliminar comentarios' })

            db.query('DELETE FROM foro_hilos WHERE id_usuario = ?', [id], (err3) => {
                if (err3) return res.status(500).json({ error: 'Error al eliminar hilos' })

                db.query('DELETE FROM usuario_membresia WHERE id_usuario = ?', [id], (err4) => {
                    if (err4) return res.status(500).json({ error: 'Error al eliminar membresías' })

                    db.query('DELETE FROM reservas WHERE id_usuario = ?', [id], (err5) => {
                        if (err5) return res.status(500).json({ error: 'Error al eliminar reservas' })

                        db.query('DELETE FROM usuarios WHERE id = ?', [id], (err6) => {
                            if (err6) return res.status(500).json({ error: 'Error al eliminar usuario' })
                            res.json({ mensaje: 'Usuario eliminado correctamente' })
                        })
                    })
                })
            })
        })
    })
}

// Stats para el dashboard
const getStats = (req, res) => {
    db.query(
        `SELECT 
            (SELECT COUNT(*) FROM usuarios) AS total_usuarios,
            (SELECT COUNT(*) FROM usuarios WHERE rol = 'admin') AS total_admins,
            (SELECT COUNT(*) FROM usuarios WHERE DATE(fecha_registro) = CURDATE()) AS registros_hoy`,
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener estadísticas' });
            res.json(results[0]);
        }
    );
};

module.exports = { getUsuarios, createUsuario, updateUsuario, deleteUsuario, getStats };