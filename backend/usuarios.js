// Módulo de usuarios para StoryUp.es
const express = require('express');
const router = express.Router();
const usuarios = [
  { id: 1, nombre: 'admin', email: 'admin@storyup.es', password: 'admin123' },
];


// Registro de usuario
router.post('/register', (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  if (usuarios.find(u => u.email === email)) {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }
  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre,
    email,
    password
  };
  usuarios.push(nuevoUsuario);
  res.status(201).json({ mensaje: 'Usuario registrado', usuario: { id: nuevoUsuario.id, nombre, email } });
});

// Login básico
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = usuarios.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ mensaje: 'Login exitoso', usuario: { id: user.id, nombre: user.nombre, email: user.email } });
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});

module.exports = router;
