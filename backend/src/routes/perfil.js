const express = require('express');
const router = express.Router();
const { getPerfil, updatePerfil } = require('../controllers/perfilController');

router.get('/:id', getPerfil);
router.put('/:id', updatePerfil);

module.exports = router;