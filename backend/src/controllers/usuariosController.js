const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registro = async (req, res) => {
    const { nombre, email, password } = req.body
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        await db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, passwordHash])
        res.status(201).json({ mensaje: 'Usuario registrado correctamente' })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'El email ya está registrado' })
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email])
        if (!results.length) return res.status(404).json({ error: 'Usuario no encontrado' })

        const usuario = results[0]
        const passwordValida = await bcrypt.compare(password, usuario.password)
        if (!passwordValida) return res.status(401).json({ error: 'Contraseña incorrecta' })

        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({
            mensaje: 'Login correcto',
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
        })
    } catch {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}

module.exports = { registro, login }
