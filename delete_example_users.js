// Script para eliminar el usuario Admin de ejemplo (email: pipo68@storyup.es)
const { Client } = require('pg');

const neonUrl = 'postgresql://neondb_owner:npg_VXD4IfyZGQF5@ep-shy-grass-ad01598r-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const client = new Client({ connectionString: neonUrl });

(async () => {
    await client.connect();
    await client.query("DELETE FROM usuarios WHERE username IS NULL OR email = 'pipo68@storyup.es'");
    console.log('Usuarios de ejemplo eliminados.');
    await client.end();
})();
