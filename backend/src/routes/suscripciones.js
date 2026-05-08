const express = require('express')
const router = express.Router()
const { getMembresias, crearMembresia, editarMembresia, eliminarMembresia, getUsuariosMembresia, asignarMembresia } = require('../controllers/suscripcionesController')

router.get('/usuarios', getUsuariosMembresia)
router.post('/asignar', asignarMembresia)
router.get('/', getMembresias)
router.post('/', crearMembresia)
router.put('/:id', editarMembresia)
router.delete('/:id', eliminarMembresia)

module.exports = router