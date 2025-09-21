// Módulo de usuarios para StoryUp.es
const express = require('express');
const router = express.Router();
const pool = require('./db');

// Login o registro instantáneo solo con nick y password
router.post('/register-or-login', async (req, res) => {
    const { nick, password } = req.body;
    if (!nick || !password) {
        return res.status(400).json({ error: 'Nick y contraseña son obligatorios' });
    }
    try {
        // Buscar usuario por nick
        const existe = await pool.query('SELECT id, nombre FROM usuarios WHERE nombre = $1', [nick]);
        if (existe.rows.length > 0) {
            // Usuario existe, comprobar contraseña
            const user = await pool.query('SELECT id, nombre FROM usuarios WHERE nombre = $1 AND password = $2', [nick, password]);
            if (user.rows.length > 0) {
                return res.json({ mensaje: 'Login exitoso', usuario: user.rows[0] });
            } else {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }
        } else {
            // Registrar nuevo usuario
            const nuevo = await pool.query('INSERT INTO usuarios (nombre, password) VALUES ($1, $2) RETURNING id, nombre', [nick, password]);
            return res.status(201).json({ mensaje: 'Usuario registrado', usuario: nuevo.rows[0] });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});



// Registro de usuario
router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    try {
        // Verificar si el email ya existe
        const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
        if (existe.rows.length > 0) {
            return res.status(409).json({ error: 'El email ya está registrado' });
        }
        // Insertar nuevo usuario
        const resultado = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
            [nombre, email, password]
        );
        res.status(201).json({ mensaje: 'Usuario registrado', usuario: resultado.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Login básico
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const resultado = await pool.query(
            'SELECT id, nombre, email FROM usuarios WHERE email = $1 AND password = $2',
            [email, password]
        );
        if (resultado.rows.length > 0) {
            res.json({ mensaje: 'Login exitoso', usuario: resultado.rows[0] });
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
