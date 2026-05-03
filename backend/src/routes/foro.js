const express = require('express');
const router = express.Router();
const { getPosts, crearPost } = require('../controllers/foroController');

router.get('/posts', getPosts);
router.post('/posts', crearPost);

module.exports = router;