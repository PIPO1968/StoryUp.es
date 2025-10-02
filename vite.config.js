import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    server: {
        port: 5181, // Configura el puerto para el servidor de desarrollo
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
});