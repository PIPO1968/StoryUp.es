const express = require('express');
const router = express.Router();
const News = require('../models/news');
const User = require('../models/user');

// Obtener las últimas 25 noticias
router.get('/', async (req, res) => {
    try {
        const news = await News.find()
            .sort({ createdAt: -1 })
            .limit(25)
            .populate('author', 'username name');
        res.json(news);
    } catch (err) {
        res.status(500).json({ error: 'Error obteniendo noticias' });
    }
});

// Obtener una noticia por ID
router.get('/:id', async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
            .populate('author', 'username name')
            .populate('comments.author', 'username name');
        if (!news) return res.status(404).json({ error: 'Noticia no encontrada' });
        res.json(news);
    } catch (err) {
        res.status(500).json({ error: 'Error obteniendo noticia' });
    }
});

// Crear una nueva noticia (solo Docente)
router.post('/', async (req, res) => {
    try {
        const { title, content, authorId, anonimo } = req.body;
        if (!title || !content || !authorId) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const author = await User.findById(authorId);
        if (!author || author.userType !== 'Docente') {
            return res.status(403).json({ error: 'Solo los docentes pueden crear noticias' });
        }
        const news = new News({
            title,
            content,
            anonimo: !!anonimo,
            author: author._id
        });
        await news.save();
        res.status(201).json(news);
    } catch (err) {
        res.status(500).json({ error: 'Error creando noticia' });
    }
});

// Like a noticia
router.post('/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: 'Falta userId' });
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ error: 'Noticia no encontrada' });
        if (news.likedBy.includes(userId)) {
            return res.status(400).json({ error: 'Ya diste like' });
        }
        news.likes += 1;
        news.likedBy.push(userId);
        await news.save();
        res.json({ likes: news.likes });
    } catch (err) {
        res.status(500).json({ error: 'Error al dar like' });
    }
});

// Comentar una noticia
router.post('/:id/comment', async (req, res) => {
    try {
        const { userId, text } = req.body;
        if (!userId || !text) return res.status(400).json({ error: 'Faltan datos' });
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ error: 'Noticia no encontrada' });
        news.comments.unshift({ author: user._id, text });
        await news.save();
        res.json(news.comments.slice(0, 5));
    } catch (err) {
        res.status(500).json({ error: 'Error al comentar' });
    }
});

module.exports = router;
