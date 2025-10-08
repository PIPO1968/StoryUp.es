require('dotenv').config();
console.log('Iniciando server.js...');
const express = require('express');
const path = require('path');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Endpoint API de ejemplo
app.use('/api/auth', require('./api/auth.js'));
app.use('/api/users', require('./api/users.js'));

// Para cualquier otra ruta, servir index.html (SPA)
app.get(/^\/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
console.log('Preparando para escuchar en el puerto', PORT);
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
