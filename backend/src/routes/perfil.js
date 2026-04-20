const express = require('express');
const router = express.Router();
const { getPerfil, updatePerfil, deletePerfil } = require('../controllers/perfilController');

router.delete('/:id', deletePerfil);
router.get('/:id', getPerfil);
router.put('/:id', updatePerfil);

module.exports = router;