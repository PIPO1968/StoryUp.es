
require('dotenv').config();
console.log('Iniciando server.js...');
const express = require('express');
const path = require('path');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Endpoints API primero
app.use('/api/auth', require('./api/auth.js'));
app.use('/api/users', require('./api/users.js'));
app.use('/api/online', require('./api/online.js'));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'dist')));


// Para cualquier otra ruta que NO sea /api, servir index.html (SPA)
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
console.log('Preparando para escuchar en el puerto', PORT);
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
