// Este script añade la columna 'password' a la tabla 'usuarios' en PostgreSQL
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function addPasswordColumn() {
    try {
        await client.connect();
        const res = await client.query(`ALTER TABLE usuarios ADD COLUMN password VARCHAR(255);`);
        console.log('Columna password añadida correctamente.');
    } catch (err) {
        console.error('Error al añadir la columna password:', err);
    } finally {
        await client.end();
    }
}

addPasswordColumn();
