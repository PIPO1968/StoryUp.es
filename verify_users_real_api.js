// Script para verificar usuarios usando la misma conexión que la API
const { Client } = require('pg');

function getClient() {
    // Usar la misma conexión que la API
    const neonUrl = 'postgresql://neondb_owner:npg_HnBMTqDUc1W8@ep-still-bread-agolimhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
    return new Client({
        connectionString: neonUrl
    });
}

async function checkUsersRealAPI() {
    const client = getClient();

    try {
        await client.connect();
        console.log('=== VERIFICANDO USUARIOS EN LA BD REAL DE LA API ===');

        // Verificar estructura de tabla
        const tableInfo = await client.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        `);

        console.log('\n=== ESTRUCTURA DE TABLA USERS ===');
        console.log(JSON.stringify(tableInfo.rows, null, 2));

        // Obtener todos los usuarios
        const users = await client.query('SELECT id, email, username, name, user_type, created_at FROM users ORDER BY id');

        console.log('\n=== TODOS LOS USUARIOS ===');
        console.log(JSON.stringify(users.rows, null, 2));

        // Buscar PIPO68 específicamente
        const pipo = await client.query('SELECT * FROM users WHERE email = $1', ['pipocanarias@hotmail.com']);
        console.log('\n=== USUARIO PIPO68 ===');
        console.log(JSON.stringify(pipo.rows, null, 2));

        // Buscar Admin específicamente  
        const admin = await client.query('SELECT * FROM users WHERE email = $1', ['piporgz68@gmail.com']);
        console.log('\n=== USUARIO ADMIN ===');
        console.log(JSON.stringify(admin.rows, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

checkUsersRealAPI();