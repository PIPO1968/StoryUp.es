// API para gestión de concursos y trofeos SIN localStorage
const express = require('express');
const router = express.Router();
const db = require('../db'); // Asume conexión a Neon/PostgreSQL

// Obtener concursos activos
router.get('/active', async (req, res) => {
    try {
        const contests = await db.query('SELECT * FROM contests WHERE status = $1', ['active']);
        res.json({ contests: contests.rows });
    } catch (err) {
        res.status(500).json({ error: 'Error al consultar concursos activos' });
    }
});

// Obtener concursos terminados
router.get('/finished', async (req, res) => {
    try {
        const contests = await db.query('SELECT * FROM contests WHERE status = $1', ['finished']);
        res.json({ contests: contests.rows });
    } catch (err) {
        res.status(500).json({ error: 'Error al consultar concursos terminados' });
    }
});

// Asignar trofeo al ganador de un concurso
const { assignTrophies } = require('./trophyHelper');
router.post('/assign-trophy', async (req, res) => {
    const { contestId, userId, trophyId } = req.body;
    try {
        // Marcar ganador en el concurso
        await db.query('UPDATE contests SET winner = $1 WHERE id = $2', [userId, contestId]);
        // Asignar trofeo al usuario (legacy)
        await db.query('INSERT INTO user_trophies (user_id, trophy_id, awarded_at) VALUES ($1, $2, NOW())', [userId, trophyId]);
        // Asignar trofeos automáticos según lógica
        await assignTrophies(db, userId);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Error al asignar trofeo al ganador' });
    }
});

// Consultar trofeos disponibles
router.get('/trophies', async (req, res) => {
    try {
        const trophies = await db.query('SELECT * FROM trophies');
        res.json({ trophies: trophies.rows });
    } catch (err) {
        res.status(500).json({ error: 'Error al consultar trofeos' });
    }
});

module.exports = router;
