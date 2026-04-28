const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const usuariosRoutes = require('./src/routes/usuarios');
app.use('/api/usuarios', usuariosRoutes);

const perfilRoutes = require('./src/routes/perfil');
app.use('/api/perfil', perfilRoutes);

const adminRoutes = require('./src/routes/admin')
app.use('/api/admin', adminRoutes)

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ mensaje: ' API ZenForce funcionando' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
