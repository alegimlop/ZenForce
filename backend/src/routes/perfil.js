const express = require('express');
const router = express.Router();
const { getPerfil, updatePerfil, deletePerfil, cambiarPassword, restablecerPassword } = require('../controllers/perfilController');

router.put('/restablecer', restablecerPassword);
router.put('/password/:id', cambiarPassword);
router.delete('/:id', deletePerfil);
router.get('/:id', getPerfil);
router.put('/:id', updatePerfil);

module.exports = router;