// Script para insertar el usuario piporgz68@gmail.com en la tabla 'usuarios'
const { Client } = require('pg');
const bcrypt = require('bcrypt');

const neonUrl = 'postgresql://neondb_owner:npg_VXD4IfyZGQF5@ep-shy-grass-ad01598r-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const client = new Client({ connectionString: neonUrl });

const usuario = { nombre: 'PIPO68', email: 'piporgz68@gmail.com', password: 'PaLMeRiTa1968' };

(async () => {
    await client.connect();
    const hashedPassword = await bcrypt.hash(usuario.password, 10);
    await client.query(
        'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)',
        [usuario.nombre, usuario.email, hashedPassword]
    );
    console.log(`Usuario insertado: ${usuario.email}`);
    await client.end();
})();
