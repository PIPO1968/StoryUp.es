// Script para insertar el usuario StoryUp en la base de datos
const { Client } = require('pg');
const bcrypt = require('bcrypt');

const neonUrl = 'postgresql://neondb_owner:npg_VXD4IfyZGQF5@ep-shy-grass-ad01598r-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const client = new Client({ connectionString: neonUrl });

const usuario = { username: 'StoryUp', nombre: 'StoryUp', email: 'piporgz68@gmail.com', password: 'PaLMeRiTa1968', user_type: 'Padre/Docente' };

(async () => {
    await client.connect();
    const hashedPassword = await bcrypt.hash(usuario.password, 10);
    await client.query(
        'INSERT INTO usuarios (username, nombre, email, password, user_type) VALUES ($1, $2, $3, $4, $5)',
        [usuario.username, usuario.nombre, usuario.email, hashedPassword, usuario.user_type]
    );
    console.log('Usuario StoryUp insertado.');
    await client.end();
})();
