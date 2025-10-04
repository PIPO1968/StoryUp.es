// Script para añadir la columna 'username' a la tabla 'usuarios'
const { Client } = require('pg');

const neonUrl = 'postgresql://neondb_owner:npg_VXD4IfyZGQF5@ep-shy-grass-ad01598r-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const client = new Client({ connectionString: neonUrl });

(async () => {
    await client.connect();
    await client.query('ALTER TABLE usuarios ADD COLUMN username VARCHAR(255) UNIQUE;');
    console.log('Columna username añadida correctamente.');
    await client.end();
})();
