const express = require('express');
const router = express.Router();
const { getPosts, crearPost, getPost } = require('../controllers/foroController');

router.get('/posts/:id', getPost);
router.get('/posts', getPosts);
router.post('/posts', crearPost);

module.exports = router;