const { neon } = require('@neondatabase/serverless');

const sql = neon('postgresql://storyup_owner:HOZMa2WPGG67@ep-crimson-dawn-a5dz0brn.us-east-2.aws.neon.tech/storyup?sslmode=require');

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