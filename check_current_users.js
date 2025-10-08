const { neon } = require('@neondatabase/serverless');

const sql = neon('postgresql://neondb_owner:npg_ZRu9fpSmzNL1@ep-shy-grass-ad01598r-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

async function checkUsers() {
    try {
        console.log('=== VERIFICANDO USUARIOS ===');

        console.log('\n=== DATOS USUARIO PIPO68 ===');
        const pipo = await sql`SELECT * FROM users WHERE email = 'pipocanarias@hotmail.com'`;
        if (pipo.length > 0) {
            console.log(JSON.stringify(pipo[0], null, 2));
        } else {
            console.log('Usuario PIPO68 no encontrado');
        }

        console.log('\n=== DATOS USUARIO ADMIN ===');
        const admin = await sql`SELECT * FROM users WHERE email = 'piporgz68@gmail.com'`;
        if (admin.length > 0) {
            console.log(JSON.stringify(admin[0], null, 2));
        } else {
            console.log('Usuario Admin no encontrado');
        }

        console.log('\n=== TODOS LOS USUARIOS ===');
        const allUsers = await sql`SELECT id, username, name, email, user_type FROM users ORDER BY id`;
        console.log(JSON.stringify(allUsers, null, 2));

    } catch (error) {
        console.error('Error:', error);
    }
}

checkUsers();