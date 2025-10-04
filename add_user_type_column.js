// Script para añadir la columna 'user_type' a la tabla 'usuarios'
const { Client } = require('pg');

const neonUrl = 'postgresql://neondb_owner:npg_VXD4IfyZGQF5@ep-shy-grass-ad01598r-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const client = new Client({ connectionString: neonUrl });

(async () => {
    await client.connect();
    await client.query("ALTER TABLE usuarios ADD COLUMN user_type VARCHAR(50) DEFAULT 'user';");
    console.log('Columna user_type añadida correctamente.');
    await client.end();
})();
