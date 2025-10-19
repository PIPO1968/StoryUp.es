const express = require('express');
const router = express.Router();
const Story = require('../models/story');
const User = require('../models/user');
const mongoose = require('mongoose');

// Obtener las últimas 25 historias (más reciente primero)
router.get('/', async (req, res) => {
    try {
        const stories = await Story.find()
            .sort({ createdAt: -1 })
            .limit(25)
            .populate('author', 'username name');
        res.json(stories);
    } catch (err) {
        res.status(500).json({ error: 'Error obteniendo historias' });
    }
});

// Obtener una historia por ID
router.get('/:id', async (req, res) => {
    try {
        const story = await Story.findById(req.params.id)
            .populate('author', 'username name')
            .populate('comments.author', 'username name');
        if (!story) return res.status(404).json({ error: 'Historia no encontrada' });
        res.json(story);
    } catch (err) {
        res.status(500).json({ error: 'Error obteniendo historia' });
    }
});

// Crear una nueva historia
router.post('/', async (req, res) => {
    try {
        const { title, content, type, theme, authorId } = req.body;
        if (!title || !content || !type || !theme || !authorId) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const author = await User.findById(authorId);
        if (!author) return res.status(404).json({ error: 'Autor no encontrado' });
        const story = new Story({
            title,
            content,
            type,
            theme,
            author: author._id
        });
        await story.save();
        res.status(201).json(story);
    } catch (err) {
        res.status(500).json({ error: 'Error creando historia' });
    }
});

// Dar like a una historia
router.post('/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: 'Falta userId' });
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ error: 'Historia no encontrada' });
        if (story.likedBy.includes(userId)) {
            return res.status(400).json({ error: 'Ya diste like' });
        }
        story.likes += 1;
        story.likedBy.push(userId);
        await story.save();
        res.json({ likes: story.likes });
    } catch (err) {
        res.status(500).json({ error: 'Error al dar like' });
    }
});

// Comentar una historia
router.post('/:id/comment', async (req, res) => {
    try {
        const { userId, text } = req.body;
        if (!userId || !text) return res.status(400).json({ error: 'Faltan datos' });
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ error: 'Historia no encontrada' });
        story.comments.unshift({ author: user._id, text });
        await story.save();
        res.json(story.comments.slice(0, 5));
    } catch (err) {
        res.status(500).json({ error: 'Error al comentar' });
    }
});

module.exports = router;
