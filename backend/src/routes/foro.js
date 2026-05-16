const express = require('express');
const router = express.Router();
const { getPosts, crearPost, getPost, eliminarPost, editarPost, añadirComentario, eliminarComentario, editarComentario, toggleLike, comprobarLike, getPostsAdmin, eliminarPostAdmin, getComentariosAdmin, eliminarComentarioAdmin, getMisPosts, getMisLikes, getMisComentarios } = require('../controllers/foroController')

router.get('/misposts/:usuarioId', getMisPosts)
router.get('/misleaks/:usuarioId', getMisLikes)
router.get('/miscomentarios/:usuarioId', getMisComentarios)
router.get('/admin/posts/:id/comentarios', getComentariosAdmin)
router.delete('/admin/comentarios/:id', eliminarComentarioAdmin)
router.get('/admin/posts', getPostsAdmin)
router.delete('/admin/posts/:id', eliminarPostAdmin)
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