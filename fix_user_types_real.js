// Script para corregir los tipos de usuario en la base de datos real
const { Client } = require('pg');

function getClient() {
    // Usar la misma conexión que la API
    const neonUrl = 'postgresql://neondb_owner:npg_HnBMTqDUc1W8@ep-still-bread-agolimhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
    return new Client({
        connectionString: neonUrl
    });
}

async function fixUserTypes() {
    const client = getClient();

    try {
        await client.connect();
        console.log('=== CORRIGIENDO TIPOS DE USUARIO ===');

        // PIPO68 debe ser 'student' (usuario normal)
        console.log('Actualizando PIPO68 a student...');
        const pipoResult = await client.query(
            'UPDATE users SET user_type = $1 WHERE email = $2 RETURNING id, username, user_type',
            ['student', 'pipocanarias@hotmail.com']
        );
        console.log('PIPO68 actualizado:', pipoResult.rows[0]);

        // Admin debe ser 'teacher' (padre-docente/admin)
        console.log('Actualizando Admin a teacher...');
        const adminResult = await client.query(
            'UPDATE users SET user_type = $1 WHERE email = $2 RETURNING id, username, user_type',
            ['teacher', 'piporgz68@gmail.com']
        );
        console.log('Admin actualizado:', adminResult.rows[0]);

        // Verificar cambios
        console.log('\n=== VERIFICANDO CAMBIOS ===');
        const allUsers = await client.query('SELECT id, username, email, user_type FROM users ORDER BY id');
        console.log(JSON.stringify(allUsers.rows, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

fixUserTypes();