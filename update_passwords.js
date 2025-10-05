// Script para actualizar contraseñas de usuarios reales en Neon/PostgreSQL usando bcrypt
const { Client } = require('pg');
const bcrypt = require('bcrypt');

const neonUrl = 'postgresql://neondb_owner:npg_HnBMTqDUc1W8@ep-still-bread-agolimhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const client = new Client({ connectionString: neonUrl });

async function updatePassword(username, plainPassword) {
    const hash = await bcrypt.hash(plainPassword, 10);
    await client.query('UPDATE users SET password = $1 WHERE username = $2', [hash, username]);
    console.log(`Contraseña actualizada para ${username}`);
}

(async () => {
    await client.connect();
    await updatePassword('PIPO68', 'PaLMeRiTa1968');
    await updatePassword('Admin', 'PaLMeRiTa1968');
    await client.end();
    console.log('Actualización de contraseñas completada.');
})();
