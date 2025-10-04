// Script para borrar el usuario admin@storyup.es de la base de datos Neon/PostgreSQL
const { Client } = require('pg');

const neonUrl = 'postgresql://neondb_owner:npg_HnBMTqDUc1W8@ep-still-bread-agolimhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const client = new Client({ connectionString: neonUrl });

(async () => {
    await client.connect();
    const res = await client.query('DELETE FROM users WHERE email = $1', ['admin@storyup.es']);
    console.log('Usuario admin@storyup.es eliminado:', res.rowCount);
    await client.end();
})();
