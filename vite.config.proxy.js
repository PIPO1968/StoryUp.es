import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    server: {
        port: 5181,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
});