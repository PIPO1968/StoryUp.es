
// Backend Express principal para StoryUp.es
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: [
        'https://www.storyup.es',
        'https://storyup.es',
        'https://www.story-up.vercel.app',
        'https://story-up.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Responder a preflight OPTIONS para todas las rutas
app.options('*', cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/storyup')
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error('Error MongoDB:', err));

// Modelos
require('./models/user');

// Rutas API
const usuariosRouter = require('./routes/usuarios');
app.use('/api', usuariosRouter);


// Servir archivos estáticos del frontend (React build)
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// SPA fallback: servir index.html para rutas que no sean /api ni archivos estáticos
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return res.status(404).send('API not found');
    // Si la ruta es un archivo existente, dejar que express.static lo maneje
    if (req.path.includes('.')) return next();
    res.sendFile(path.join(buildPath, 'index.html'));
});


// Middleware de manejo de errores para rutas /api
app.use('/api', (err, req, res, next) => {
    res.status(500).json({ error: 'Error interno del servidor', details: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
