
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

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
                userType: userType || 'Usuario'
            });
            await user.save();
        } else {
            // Login
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(400).json({ error: 'Contraseña incorrecta' });
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

const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
                avatar: user.avatar,
                _id: user._id
            }
        });
    } catch (err) {
        res.status(401).json({ error: 'Token inválido', details: err.message });
    }
});
