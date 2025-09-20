// Backend Express básico para StoryUp.es

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({
    origin: 'https://story-up-es.vercel.app',
    credentials: true
}));
app.use(express.json());


app.get('/', (req, res) => {
    res.send('API StoryUp.es funcionando');
});

// Endpoint de salud para Render
app.get('/healthz', (req, res) => res.send('OK'));

// Aquí se agregarán rutas de usuarios, login, grupos y mensajes
// Rutas de usuarios y login
const usuariosRouter = require('./usuarios');
app.use('/api', usuariosRouter);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
