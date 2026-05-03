const express = require('express');
const router = express.Router();
const { getPosts, crearPost, getPost, eliminarPost, editarPost, añadirComentario, eliminarComentario, editarComentario, toggleLike, comprobarLike } = require('../controllers/foroController')
router.put('/comentarios/:id', editarComentario)
router.put('/posts/:id', editarPost)
router.post('/posts/:id/like', toggleLike)
router.get('/posts/:id/like/:userId', comprobarLike)
router.delete('/comentarios/:id', eliminarComentario)
router.post('/posts/:id/comentarios', añadirComentario)
router.delete('/posts/:id', eliminarPost)
router.get('/posts/:id', getPost);
router.get('/posts', getPosts);
router.post('/posts', crearPost);

module.exports = router;