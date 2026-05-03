const express = require('express');
const router = express.Router();
const { getPosts, crearPost, getPost, eliminarPost } = require('../controllers/foroController')

router.delete('/posts/:id', eliminarPost)
router.get('/posts/:id', getPost);
router.get('/posts', getPosts);
router.post('/posts', crearPost);

module.exports = router;