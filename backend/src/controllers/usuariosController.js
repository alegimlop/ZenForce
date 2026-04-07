const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTRO
const registro = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, passwordHash],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ error: 'El email ya está registrado' });
                    }
                    return res.status(500).json({ error: 'Error al registrar usuario' });
                }
                res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
            }
        );
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// LOGIN
const login = (req, res) => {
    const { email, password } = req.body;

    db.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email],
        async (err, results) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' });
            if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

            const usuario = results[0];
            const passwordValida = await bcrypt.compare(password, usuario.password);

            if (!passwordValida) return res.status(401).json({ error: 'Contraseña incorrecta' });

            const token = jwt.sign(
                { id: usuario.id, rol: usuario.rol },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                mensaje: 'Login correcto',
                token,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                }
            });
        }
    );
};

module.exports = { registro, login };