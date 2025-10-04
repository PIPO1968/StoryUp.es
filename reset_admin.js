// Script para eliminar el usuario Admin y crearlo de nuevo
const { Client } = require('pg');
const bcrypt = require('bcrypt');

const neonUrl = 'postgresql://neondb_owner:npg_VXD4IfyZGQF5@ep-shy-grass-ad01598r-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const client = new Client({ connectionString: neonUrl });

const usuario = { username: 'Admin', nombre: 'Admin', email: 'piporgz68@gmail.com', password: 'PaLMeRiTa1968' };

(async () => {
    await client.connect();
    await client.query('DELETE FROM usuarios WHERE email = $1', [usuario.email]);
    const hashedPassword = await bcrypt.hash(usuario.password, 10);
    await client.query(
        'INSERT INTO usuarios (username, nombre, email, password) VALUES ($1, $2, $3, $4)',
        [usuario.username, usuario.nombre, usuario.email, hashedPassword]
    );
    console.log(`Usuario Admin eliminado y creado de nuevo.`);
    await client.end();
})();
