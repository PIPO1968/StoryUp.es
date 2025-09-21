// Backend Express básico para StoryUp.es

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({
    origin: function (origin, callback) {
        const allowed = [
            'https://storyup.es',
            'https://www.storyup.es',
            'https://story-up-es.vercel.app',
            'https://story-up-9nhrztg0i-pipo68s-projects.vercel.app'
        ];
        const vercelPreview = /^https:\/\/story-up-[^.]+\.vercel\.app$/;
        if (!origin || allowed.includes(origin) || vercelPreview.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
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
