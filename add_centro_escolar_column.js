// Script para añadir el campo 'centro_escolar' a la tabla 'usuarios' en Neon/PostgreSQL
const { Client } = require('pg');

const neonUrl = 'postgresql://neondb_owner:npg_VXD4IfyZGQF5@ep-shy-grass-ad01598r-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const client = new Client({ connectionString: neonUrl });

(async () => {
    await client.connect();
    try {
        await client.query('ALTER TABLE usuarios ADD COLUMN centro_escolar VARCHAR(128);');
        console.log('Columna centro_escolar añadida correctamente.');
    } catch (err) {
        console.error('Error al añadir la columna:', err.message);
    }
    await client.end();
})();
