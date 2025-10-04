// Script para actualizar la contraseña del usuario Admin en la tabla 'usuarios'
const { Client } = require('pg');
const bcrypt = require('bcrypt');

const neonUrl = 'postgresql://neondb_owner:npg_VXD4IfyZGQF5@ep-shy-grass-ad01598r-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const client = new Client({ connectionString: neonUrl });

const email = 'piporgz68@gmail.com';
const newPassword = 'PaLMeRiTa1968';

(async () => {
    await client.connect();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const res = await client.query(
        'UPDATE usuarios SET password = $1 WHERE email = $2 RETURNING id, nombre, email',
        [hashedPassword, email]
    );
    if (res.rows.length > 0) {
        console.log('Contraseña actualizada para:', res.rows[0]);
    } else {
        console.log('Usuario no encontrado:', email);
    }
    await client.end();
})();
