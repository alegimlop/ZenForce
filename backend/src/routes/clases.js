const express = require('express');
const router = express.Router();
const { getClases, getMisClases, inscribirse, cancelarInscripcion, crearClase, editarClase, eliminarClase } = require('../controllers/clasesController');

router.get('/', getClases);
router.get('/mis-clases/:usuarioId', getMisClases);
router.post('/:claseId/inscribir', inscribirse);
router.delete('/:claseId/inscribir', cancelarInscripcion);
router.post('/', crearClase);
router.put('/:id', editarClase);
router.delete('/:id', eliminarClase);

module.exports = router;
