
// Backend Express principal para StoryUp.es
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors({
    origin: [
        'https://www.storyup.es',
        'https://storyup.es',
        'https://story-up.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error('Error MongoDB:', err));


// Modelos
require('./models/user');
require('./models/story');
require('./models/news');
require('./models/event');

// Rutas API
const usuariosRouter = require('./routes/usuarios');
const storiesRouter = require('./routes/stories');
const newsRouter = require('./routes/news');
const eventRouter = require('./routes/event');
app.use('/api', usuariosRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/news', newsRouter);
app.use('/api/event', eventRouter);
// Endpoint de Health Check para Render
app.get('/healthz', (req, res) => {
    res.status(200).json({ status: "ok" });
});

// --- Eliminado el servido de archivos estáticos del frontend para despliegue en Render ---


// Middleware de manejo de errores para rutas /api
app.use('/api', (err, req, res, next) => {
    res.status(500).json({ error: 'Error interno del servidor', details: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
