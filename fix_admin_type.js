const { Client } = require('pg');

// Usar la misma conexión que el API
const connectionString = 'postgresql://neondb_owner:npg_HnBMTqDUc1W8@ep-still-bread-agolimhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function fixAdminUserType() {
    const client = new Client({ connectionString });

    try {
        await client.connect();

        console.log('=== CORRIGIENDO TIPO DE USUARIO ADMIN ===');

        // Mostrar estado actual
        const currentAdmin = await client.query('SELECT id, email, username, user_type FROM users WHERE email = $1', ['piporgz68@gmail.com']);
        console.log('Estado actual del Admin:', JSON.stringify(currentAdmin.rows[0], null, 2));

        // Corregir tipos de usuario: PIPO68 = padre-docente, Admin = user
        console.log('\n=== CORRIGIENDO PIPO68 A PADRE-DOCENTE ===');
        const pipoResult = await client.query(`
      UPDATE users 
      SET user_type = $1, updated_at = NOW()
      WHERE email = $2
      RETURNING id, email, username, user_type, updated_at
    `, ['padre-docente', 'pipocanarias@hotmail.com']);

        console.log('PIPO68 actualizado:', JSON.stringify(pipoResult.rows[0], null, 2));

        console.log('\n=== CONFIRMANDO ADMIN COMO USER ===');
        const adminResult = await client.query(`
      UPDATE users 
      SET user_type = $1, updated_at = NOW()
      WHERE email = $2
      RETURNING id, email, username, user_type, updated_at
    `, ['user', 'piporgz68@gmail.com']);

        console.log('Admin confirmado:', JSON.stringify(adminResult.rows[0], null, 2));

        console.log('\n=== TIPOS DE USUARIO CORREGIDOS ===');

        // Verificar ambos usuarios
        console.log('\n=== VERIFICACIÓN FINAL ===');
        const allUsers = await client.query('SELECT id, email, username, user_type FROM users ORDER BY id');
        allUsers.rows.forEach((user, index) => {
            console.log(`Usuario ${index + 1}:`, JSON.stringify(user, null, 2));
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

fixAdminUserType();