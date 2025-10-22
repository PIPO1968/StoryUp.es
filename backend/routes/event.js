const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// Endpoint universal para guardar cualquier evento/cambio
router.post('/', async (req, res) => {
    try {
        const { userId, type, data } = req.body;
        if (!type || !data) {
            return res.status(400).json({ error: 'type y data son obligatorios' });
        }
        const event = new Event({ userId, type, data });
        await event.save();
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Error al guardar el evento' });
    }
});

module.exports = router;
