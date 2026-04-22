const db = require('../db');
const bcrypt = require('bcrypt');

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
            if (err) return res.status(500).json({ error: 'Error al obtener perfil' })
            if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
            res.json(results[0])
        }
    )
}

const updatePerfil = (req, res) => {
    const id = req.params.id;
    const { nombre, email } = req.body;

    db.query(
        'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
        [nombre, email, id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar perfil' })
            res.json({ mensaje: 'Perfil actualizado correctamente' })
        }
    )
}
const deletePerfil = (req, res) => {
    const id = req.params.id;

    db.query(
        'DELETE FROM usuarios WHERE id = ?',
        [id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar usuario' })
            res.json({ mensaje: 'Usuario eliminado correctamente' })
        }
    )
}
const cambiarPassword = async (req, res) => {
    const id = req.params.id;
    const { passwordActual, passwordNueva } = req.body;

    db.query(
        'SELECT password FROM usuarios WHERE id = ?',
        [id],
        async (err, results) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' })
            if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' })

            const passwordValida = await bcrypt.compare(passwordActual, results[0].password)
            if (!passwordValida) return res.status(401).json({ error: 'La contraseña actual es incorrecta' })

            const passwordHash = await bcrypt.hash(passwordNueva, 10)

            db.query(
                'UPDATE usuarios SET password = ? WHERE id = ?',
                [passwordHash, id],
                (err) => {
                    if (err) return res.status(500).json({ error: 'Error al cambiar la contraseña' })
                    res.json({ mensaje: 'Contraseña cambiada correctamente' })
                }
            )
        }
    )
}
module.exports = { getPerfil, updatePerfil, deletePerfil, cambiarPassword }