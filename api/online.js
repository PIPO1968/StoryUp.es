
const express = require('express');
const router = express.Router();
const { Client } = require('pg');
let onlineUsers = new Map();

function getClient() {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    return new Client({ connectionString });
}

// Middleware CORS para este router
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Marcar usuario como online o actualizar timestamp
router.post('/', (req, res) => {
    const { userId } = req.body;
    console.log('[ONLINE] POST recibido:', { userId });
    if (!userId) return res.status(400).json({ error: 'Falta userId' });
    onlineUsers.set(userId, Date.now());
    console.log('[ONLINE] Estado actual:', Array.from(onlineUsers.entries()));
    return res.json({ success: true, online: Array.from(onlineUsers.keys()) });
});

// Marcar usuario como offline
router.delete('/', (req, res) => {
    const { userId } = req.body;
    console.log('[ONLINE] DELETE recibido:', { userId });
    if (!userId) return res.status(400).json({ error: 'Falta userId' });
    onlineUsers.delete(userId);
    console.log('[ONLINE] Estado actual:', Array.from(onlineUsers.entries()));
    return res.json({ success: true, online: Array.from(onlineUsers.keys()) });
});

// Obtener lista y contador de usuarios online (solo activos <2h)
router.get('/', (req, res) => {
    const now = Date.now();
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    for (const [userId, lastActive] of onlineUsers.entries()) {
        if (now - lastActive > TWO_HOURS) {
            onlineUsers.delete(userId);
        }
    }
    console.log('[ONLINE] GET contador:', { onlineCount: onlineUsers.size, online: Array.from(onlineUsers.keys()) });
    return res.json({ onlineCount: onlineUsers.size, online: Array.from(onlineUsers.keys()) });
});

module.exports = router;
