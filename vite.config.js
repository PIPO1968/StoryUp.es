import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    server: {
        port: 5181, // Configura el puerto para el servidor de desarrollo
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    preview: {
        allowedHosts: ["storyup-es-0cs1.onrender.com"]
    }
});