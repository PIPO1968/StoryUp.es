// Backend Express básico para StoryUp.es
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API StoryUp.es funcionando');
});

// Aquí se agregarán rutas de usuarios, login, grupos y mensajes

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
