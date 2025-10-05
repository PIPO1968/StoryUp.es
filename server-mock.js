// API Mock para simular el backend original
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Base de datos simulada en memoria
let users = [
    {
        _id: '1',
        username: 'usuario_demo',
        email: 'demo@storyup.es',
        password: '$2a$10$example.hash.demo', // hash de "123456"
        userType: 'usuario'
    }
];
let totalUsuarios = 1247;
let usuariosOnline = 89;

// Rutas API simuladas
app.post('/api/register-or-login', async (req, res) => {
    const { email, password, username, userType } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    let user = users.find(u => u.email === email);

    if (!user) {
        // Registro
        if (!username) {
            return res.status(400).json({ error: 'Falta el nombre de usuario para registro' });
        }

        const hashed = await bcrypt.hash(password, 10);
        user = {
            _id: Date.now().toString(),
            email,
            password: hashed,
            username,
            userType: userType || 'usuario'
        };
        users.push(user);
        totalUsuarios++;
    } else {
        // Login - para la demo, aceptamos cualquier contraseña
        // En producción usarías: const match = await bcrypt.compare(password, user.password);
        console.log('Login simulado para:', email);
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        'demo_secret',
        { expiresIn: '7d' }
    );

    res.json({
        token,
        user: {
            _id: user._id,
            email: user.email,
            username: user.username,
            userType: user.userType
        }
    });
});

app.get('/api/usuarios/total', (req, res) => {
    res.json({ total: totalUsuarios });
});

app.get('/api/usuarios/online', (req, res) => {
    res.json({ online: usuariosOnline });
});

// Actualizar contadores cada 10 segundos
setInterval(() => {
    totalUsuarios += Math.floor(Math.random() * 3) - 1; // +/- 1
    usuariosOnline += Math.floor(Math.random() * 5) - 2; // +/- 2

    if (totalUsuarios < 1000) totalUsuarios = 1000;
    if (usuariosOnline < 50) usuariosOnline = 50;
}, 10000);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 StoryUp API Mock ejecutándose en puerto ${PORT}`);
    console.log(`📊 Usuarios totales: ${totalUsuarios}`);
    console.log(`🟢 Usuarios online: ${usuariosOnline}`);
});

module.exports = app;