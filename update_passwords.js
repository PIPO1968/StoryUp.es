// Script para actualizar las contraseñas a las correctas
const { Client } = require('pg');
const bcrypt = require('bcrypt');

function getClient() {
    const neonUrl = 'postgresql://neondb_owner:npg_HnBMTqDUc1W8@ep-still-bread-agolimhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
    return new Client({
        connectionString: neonUrl
    });
}

async function updatePasswords() {
    const client = getClient();

    try {
        await client.connect();
        console.log('=== ACTUALIZANDO CONTRASEÑAS CORRECTAS ===');

        // Generar hash para PIPO68
        console.log('\n1. Generando hash para PIPO68 (pipo1968)...');
        const pipoPassword = 'pipo1968';
        const pipoHash = await bcrypt.hash(pipoPassword, 10);
        console.log('Hash generado para PIPO68:', pipoHash);

        // Actualizar PIPO68
        const pipoResult = await client.query(
            'UPDATE users SET password = $1 WHERE email = $2 RETURNING id, username, email',
            [pipoHash, 'pipocanarias@hotmail.com']
        );
        console.log('✅ PIPO68 actualizado:', pipoResult.rows[0]);

        // Generar hash para Admin
        console.log('\n2. Generando hash para Admin (admin123)...');
        const adminPassword = 'admin123';
        const adminHash = await bcrypt.hash(adminPassword, 10);
        console.log('Hash generado para Admin:', adminHash);

        // Actualizar Admin
        const adminResult = await client.query(
            'UPDATE users SET password = $1 WHERE email = $2 RETURNING id, username, email',
            [adminHash, 'piporgz68@gmail.com']
        );
        console.log('✅ Admin actualizado:', adminResult.rows[0]);

        console.log('\n=== CONTRASEÑAS ACTUALIZADAS ===');
        console.log('PIPO68: pipocanarias@hotmail.com / pipo1968');
        console.log('Admin: piporgz68@gmail.com / admin123');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

updatePasswords();