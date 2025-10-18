// Total de usuarios registrados
router.get('/total', async (req, res) => {
    try {
        const total = await User.countDocuments();
        res.json({ total });
    } catch (err) {
        res.status(500).json({ error: 'Error al contar usuarios', details: err.message });
    }
});

// Usuarios online (real: usuarios con actividad en los últimos 5 minutos)
router.get('/online', async (req, res) => {
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const online = await User.countDocuments({ lastActive: { $gte: fiveMinutesAgo } });
        res.json({ online });
    } catch (err) {
        res.status(500).json({ error: 'Error al contar usuarios online', details: err.message });
    }
});
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Data = require('../models/data');

// Crear nuevo dato genérico
router.post('/data', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }
    const token = auth.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const { type, content, meta } = req.body;
        if (!type || !content) return res.status(400).json({ error: 'Tipo y contenido requeridos' });
        const data = new Data({
            type,
            userId: decoded.userId,
            content,
            meta: meta || {}
        });
        await data.save();
        res.json({ success: true, data });
    } catch (err) {
        res.status(401).json({ error: 'Token inválido', details: err.message });
    }
});

// Consultar datos por tipo, usuario, etc.
router.get('/data', async (req, res) => {
    const { type, userId, limit = 50, skip = 0 } = req.query;
    const query = {};
    if (type) query.type = type;
    if (userId) query.userId = userId;
    try {
        const items = await Data.find(query).sort({ createdAt: -1 }).skip(Number(skip)).limit(Number(limit));
        res.json({ items });
    } catch (err) {
        res.status(500).json({ error: 'Error al consultar datos', details: err.message });
    }
});


// Actualizar avatar del usuario autenticado
router.post('/me/avatar', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }
    const token = auth.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const { avatar } = req.body;
        if (!avatar) return res.status(400).json({ error: 'Avatar requerido' });
        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { avatar },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({
            avatar: user.avatar
        });
    } catch (err) {
        res.status(401).json({ error: 'Token inválido', details: err.message });
    }
});


// Registro o login
router.post('/register-or-login', async (req, res) => {
    try {
        const { email, password, username, realName, userType } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
        let user = await User.findOne({ email });
        if (!user) {
            // Registro
            if (!username) return res.status(400).json({ error: 'Falta el nombre de usuario para registro' });
            const hashed = await bcrypt.hash(password, 10);
            user = new User({
                email,
                password: hashed,
                username,
                realName: realName || '',
                userType: userType || 'Usuario',
                lastActive: new Date()
            });
            await user.save();
        } else {
            // Login
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(400).json({ error: 'Contraseña incorrecta' });
            // Actualizar datos personales si se envían y son diferentes
            let updated = false;
            if (realName && realName !== user.realName) {
                user.realName = realName;
                updated = true;
            }
            if (userType && userType !== user.userType) {
                user.userType = userType;
                updated = true;
            }
            // Actualizar lastActive siempre que haga login
            user.lastActive = new Date();
            updated = true;
            if (updated) await user.save();
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({
            token,
            user: {
                email: user.email,
                username: user.username,
                realName: user.realName,
                userType: user.userType,
                _id: user._id
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
});


module.exports = router;

router.get('/me', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }
    const token = auth.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        // Actualizar lastActive a ahora
        user.lastActive = new Date();
        await user.save();
        res.json({
            user: {
                email: user.email,
                username: user.username,
                realName: user.realName,
                userType: user.userType,
                avatar: user.avatar,
                _id: user._id
            }
        });
    } catch (err) {
        res.status(401).json({ error: 'Token inválido', details: err.message });
    }
});
