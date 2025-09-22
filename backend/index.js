
// Backend Express principal para StoryUp.es
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: false, // No es necesario CORS si frontend y backend van juntos
    credentials: true
}));
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/storyup', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado')).catch(err => console.error('Error MongoDB:', err));

// Modelos
require('./models/user');

// Rutas API
const usuariosRouter = require('./routes/usuarios');
app.use('/api', usuariosRouter);

// Servir frontend estático (React build)
const buildPath = path.join(__dirname, '../frontend/build');
const fs = require('fs');
if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
    // SPA fallback: cualquier ruta que no sea API devuelve index.html
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) return res.status(404).send('API not found');
        res.sendFile(path.join(buildPath, 'index.html'));
    });
} else {
    app.get('*', (req, res) => {
        res.status(500).send('El frontend no está compilado. Por favor, ejecuta npm run build en frontend.');
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
