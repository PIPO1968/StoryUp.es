// Script para debuggear el proceso de login paso a paso
const { Client } = require('pg');
const bcrypt = require('bcrypt');

function getClient() {
    const neonUrl = 'postgresql://neondb_owner:npg_HnBMTqDUc1W8@ep-still-bread-agolimhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
    return new Client({
        connectionString: neonUrl
    });
}

async function debugLogin(email, password) {
    const client = getClient();

    try {
        await client.connect();
        console.log(`=== DEBUGGEANDO LOGIN PARA: ${email} ===`);

        // Paso 1: Buscar usuario por email o username
        console.log('\n1. Buscando usuario...');
        const existingUser = await client.query(
            `SELECT * FROM users WHERE email = $1 OR username = $1`,
            [email]
        );

        if (existingUser.rows.length === 0) {
            console.log('❌ Usuario no encontrado');
            return;
        }

        const user = existingUser.rows[0];
        console.log('✅ Usuario encontrado:', {
            id: user.id,
            email: user.email,
            username: user.username,
            user_type: user.user_type
        });

        // Paso 2: Verificar contraseña
        console.log('\n2. Verificando contraseña...');
        console.log('Contraseña proporcionada:', password);
        console.log('Hash en BD:', user.password);
        console.log('Es hash bcrypt:', user.password.startsWith('$2'));

        const isHashedPassword = user.password && user.password.startsWith('$2');
        let isValidPassword = false;

        if (isHashedPassword) {
            console.log('Usando bcrypt.compare...');
            isValidPassword = await bcrypt.compare(password, user.password);
        } else {
            console.log('Comparación directa de texto...');
            isValidPassword = password === user.password;
        }

        console.log('Contraseña válida:', isValidPassword);

        if (isValidPassword) {
            console.log('✅ LOGIN EXITOSO');
        } else {
            console.log('❌ CONTRASEÑA INCORRECTA');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

// Probar con ambos usuarios
async function testBothUsers() {
    console.log('='.repeat(60));
    await debugLogin('pipocanarias@hotmail.com', 'pipo1968');
    console.log('\n' + '='.repeat(60));
    await debugLogin('piporgz68@gmail.com', 'admin123');
    console.log('='.repeat(60));
}

testBothUsers();