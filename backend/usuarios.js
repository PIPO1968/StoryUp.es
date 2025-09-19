// Módulo de usuarios para StoryUp.es
const express = require('express');
const router = express.Router();
const usuarios = [
  { id: 1, nombre: 'admin', email: 'admin@storyup.es', password: 'admin123' },
];

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
