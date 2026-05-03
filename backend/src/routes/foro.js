const express = require('express');
const router = express.Router();
const { getPosts, crearPost, getPost, eliminarPost, añadirComentario, eliminarComentario, toggleLike, comprobarLike } = require('../controllers/foroController')
router.post('/posts/:id/like', toggleLike)
router.get('/posts/:id/like/:userId', comprobarLike)
router.delete('/comentarios/:id', eliminarComentario)
router.post('/posts/:id/comentarios', añadirComentario)
router.delete('/posts/:id', eliminarPost)
router.get('/posts/:id', getPost);
router.get('/posts', getPosts);
router.post('/posts', crearPost);

module.exports = router;