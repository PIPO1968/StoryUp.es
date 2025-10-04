// Script para mostrar todos los usuarios y sus columnas en la tabla 'usuarios'
const { Client } = require('pg');

const neonUrl = 'postgresql://neondb_owner:npg_VXD4IfyZGQF5@ep-shy-grass-ad01598r-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const client = new Client({ connectionString: neonUrl });

(async () => {
    await client.connect();
    const res = await client.query('SELECT * FROM usuarios');
    console.table(res.rows);
    await client.end();
})();
