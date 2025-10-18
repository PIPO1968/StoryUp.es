
const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });
    jwt.verify(token, process.env.JWT_SECRET || 'secret', async (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        // Actualizar lastActive si existe userId
        if (user && user.userId) {
            try {
                await User.findByIdAndUpdate(user.userId, { lastActive: new Date() });
            } catch (e) { /* ignorar error de actualización */ }
        }
        next();
    });
}

module.exports = auth;
