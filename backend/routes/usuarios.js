
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Data = require('../models/data');

// Eliminar todos los usuarios al iniciar para empezar desde cero
User.deleteMany({}).then(() => console.log('Todos los usuarios eliminados (reset inicial)')).catch(console.error);

// Estadísticas de usuarios: total y online (simulado)
router.get('/usuarios/contador', async (req, res) => {
    try {
        const total = await User.countDocuments();
        // Simulación: usuarios online = usuarios que han iniciado sesión en los últimos 10 minutos (requiere campo updatedAt)
        // Por ahora, devolvemos un número aleatorio entre 1 y total
        const online = Math.max(1, Math.floor(Math.random() * total));
        res.json({ total, online });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener estadísticas', details: err.message });
    }
});

// Solo login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Contraseña incorrecta' });
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({
            token,
            user: {
                email: user.email,
                username: user.username,
                realName: user.realName,
                userType: user.userType,
                centroTipo: user.centroTipo,
                centroNombre: user.centroNombre,
                _id: user._id
            }
        });
    } catch (err) {
        console.error('Error interno en /login:', err);
        res.status(500).json({ error: 'Error interno del servidor', details: err.message, stack: err.stack });
    }
});


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
        const { email, password, username, realName, userType, centroTipo, centroNombre } = req.body;
        console.log('Datos recibidos en registro:', req.body);
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
                centroTipo: centroTipo || '',
                centroNombre: centroNombre || ''
            });
            try {
                await user.save();
            } catch (saveErr) {
                console.error('Error al guardar usuario:', saveErr);
                return res.status(500).json({ error: 'Error al guardar usuario', details: saveErr.message });
            }
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
            if (centroTipo && centroTipo !== user.centroTipo) {
                user.centroTipo = centroTipo;
                updated = true;
            }
            if (centroNombre && centroNombre !== user.centroNombre) {
                user.centroNombre = centroNombre;
                updated = true;
            }
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
                centroTipo: user.centroTipo,
                centroNombre: user.centroNombre,
                _id: user._id
            }
        });
    } catch (err) {
        console.error('Error interno en /register-or-login:', err);
        res.status(500).json({ error: 'Error interno del servidor', details: err.message, stack: err.stack });
    }
});



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
        res.json({
            user: {
                email: user.email,
                username: user.username,
                realName: user.realName,
                userType: user.userType,
                centroTipo: user.centroTipo,
                centroNombre: user.centroNombre,
                avatar: user.avatar,
                _id: user._id
            }
        });
    } catch (err) {
        res.status(401).json({ error: 'Token inválido', details: err.message });
    }
});

module.exports = router;
