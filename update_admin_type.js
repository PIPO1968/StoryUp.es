// Script para actualizar el campo user_type del usuario Admin a 'Padre/Docente'
const { Client } = require('pg');

const neonUrl = 'postgresql://neondb_owner:npg_VXD4IfyZGQF5@ep-shy-grass-ad01598r-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const client = new Client({ connectionString: neonUrl });

(async () => {
    await client.connect();
    await client.query(
        "UPDATE usuarios SET user_type = 'Padre/Docente' WHERE email = 'piporgz68@gmail.com'"
    );
    console.log('user_type de Admin actualizado a Padre/Docente');
    await client.end();
})();
