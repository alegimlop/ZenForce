const express = require('express');
const router = express.Router();
const { getPosts } = require('../controllers/foroController');

router.get('/posts', getPosts);

module.exports = router;