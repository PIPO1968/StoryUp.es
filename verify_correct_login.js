// Script para verificar las credenciales correctas
const { Client } = require('pg');
const bcrypt = require('bcrypt');

function getClient() {
    const neonUrl = 'postgresql://neondb_owner:npg_HnBMTqDUc1W8@ep-still-bread-agolimhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
    return new Client({
        connectionString: neonUrl
    });
}

async function verifyCorrectLogin(email, password) {
    const client = getClient();

    try {
        await client.connect();
        console.log(`=== VERIFICANDO LOGIN: ${email} ===`);

        // Buscar usuario
        const existingUser = await client.query(
            `SELECT * FROM users WHERE email = $1 OR username = $1`,
            [email]
        );

        if (existingUser.rows.length === 0) {
            console.log('❌ Usuario no encontrado');
            return;
        }

        const user = existingUser.rows[0];
        console.log('Usuario encontrado:', {
            username: user.username,
            email: user.email,
            user_type: user.user_type
        });

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('Contraseña válida:', isValidPassword);

        if (isValidPassword) {
            const role = user.user_type === 'teacher' ? 'Padre/Docente' : 'Usuario';
            console.log(`✅ LOGIN EXITOSO como: ${role}`);
        } else {
            console.log('❌ CONTRASEÑA INCORRECTA');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

async function testCorrectCredentials() {
    console.log('='.repeat(60));
    await verifyCorrectLogin('pipocanarias@hotmail.com', 'PaLMeRiTa1968');
    console.log('\n' + '='.repeat(60));
    await verifyCorrectLogin('piporgz68@gmail.com', 'PaLMeRiTa1968');
    console.log('='.repeat(60));
}

testCorrectCredentials();