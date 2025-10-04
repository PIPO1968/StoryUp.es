// Script para actualizar las contraseñas CORRECTAS
const { Client } = require('pg');
const bcrypt = require('bcrypt');

function getClient() {
    const neonUrl = 'postgresql://neondb_owner:npg_HnBMTqDUc1W8@ep-still-bread-agolimhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
    return new Client({
        connectionString: neonUrl
    });
}

async function updateCorrectPasswords() {
    const client = getClient();

    try {
        await client.connect();
        console.log('=== ACTUALIZANDO CONTRASEÑAS CORRECTAS ===');

        // La contraseña correcta para ambos usuarios
        const correctPassword = 'PaLMeRiTa1968';

        // Generar hash para la contraseña correcta
        console.log('\n1. Generando hash para contraseña: PaLMeRiTa1968');
        const passwordHash = await bcrypt.hash(correctPassword, 10);
        console.log('Hash generado:', passwordHash);

        // Actualizar PIPO68
        console.log('\n2. Actualizando PIPO68...');
        const pipoResult = await client.query(
            'UPDATE users SET password = $1 WHERE email = $2 RETURNING id, username, email, user_type',
            [passwordHash, 'pipocanarias@hotmail.com']
        );
        console.log('✅ PIPO68 actualizado:', pipoResult.rows[0]);

        // Actualizar Admin
        console.log('\n3. Actualizando Admin...');
        const adminResult = await client.query(
            'UPDATE users SET password = $1 WHERE email = $2 RETURNING id, username, email, user_type',
            [passwordHash, 'piporgz68@gmail.com']
        );
        console.log('✅ Admin actualizado:', adminResult.rows[0]);

        console.log('\n=== CREDENCIALES CORRECTAS ===');
        console.log('PIPO68: pipocanarias@hotmail.com / PaLMeRiTa1968 → Usuario (student)');
        console.log('Admin: piporgz68@gmail.com / PaLMeRiTa1968 → Padre/Docente (teacher)');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

updateCorrectPasswords();