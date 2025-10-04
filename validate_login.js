// Script para validar el login de los usuarios reales
const axios = require('axios');

const endpoint = 'https://story-up-llwrolxav-pipo68s-projects.vercel.app/api/auth'; // URL Vercel

const usuarios = [
    { email: 'pipocanarias@hotmail.com', password: 'PaLMeRiTa1968' },
    { email: 'piporgz68@gmail.com', password: 'PaLMeRiTa1968' }
];

(async () => {
    for (const usuario of usuarios) {
        try {
            const res = await axios.post(endpoint, usuario);
            console.log(`Login exitoso para: ${usuario.email}`);
            console.log('Token:', res.data.token);
            console.log('Usuario:', res.data.user);
        } catch (err) {
            console.error(`Error de login para: ${usuario.email}`);
            if (err.response) {
                console.error('Respuesta:', err.response.data);
            } else {
                console.error('Error:', err.message);
            }
        }
    }
})();
