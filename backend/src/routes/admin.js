const express = require('express')
const router = express.Router()
const { getUsuarios, createUsuario, updateUsuario, deleteUsuario, getStats } = require('../controllers/adminController')

router.get('/stats', getStats)
router.get('/usuarios', getUsuarios)
router.post('/usuarios', createUsuario)
router.put('/usuarios/:id', updateUsuario)
router.delete('/usuarios/:id', deleteUsuario)

module.exports = router