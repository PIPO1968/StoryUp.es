const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Registro o login
router.post('/register-or-login', async (req, res) => {
    const { email, password, username } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
    let user = await User.findOne({ email });
    if (!user) {
        // Registro
        if (!username) return res.status(400).json({ error: 'Falta el nombre de usuario para registro' });
        const hashed = await bcrypt.hash(password, 10);
        user = new User({ email, password: hashed, username });
        await user.save();
    } else {
        // Login
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Contraseña incorrecta' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { email: user.email, username: user.username, _id: user._id } });
});

module.exports = router;
