// Script para hacer una petición real a la API de Vercel y ver qué respuesta da
const https = require('https');

async function testVercelAPI() {
    console.log('=== PROBANDO API DE VERCEL ===');

    // Test de credenciales PIPO68
    const testLogin = async (email, password, testName) => {
        console.log(`\n--- ${testName} ---`);

        const postData = JSON.stringify({
            email: email,
            password: password
        });

        const options = {
            hostname: 'story-up-es.vercel.app', // Cambiar por tu dominio de Vercel
            port: 443,
            path: '/api/auth',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    console.log('Status Code:', res.statusCode);
                    console.log('Response Headers:', res.headers);
                    console.log('Response Body:', data);
                    resolve(data);
                });
            });

            req.on('error', (error) => {
                console.error('Error en petición:', error);
                reject(error);
            });

            req.write(postData);
            req.end();
        });
    };

    try {
        await testLogin('pipocanarias@hotmail.com', 'PaLMeRiTa1968', 'PIPO68');
        await testLogin('piporgz68@gmail.com', 'PaLMeRiTa1968', 'Admin');
    } catch (error) {
        console.error('Error general:', error);
    }
}

testVercelAPI();