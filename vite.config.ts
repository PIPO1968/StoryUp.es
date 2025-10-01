import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        hmr: {
            overlay: false,  // Deshabilitar overlay de errores que causa problemas
            clientPort: 24678  // Puerto fijo para el cliente HMR
        },
        watch: {
            usePolling: true,  // Usar polling en lugar de eventos del sistema de archivos
            interval: 2000,    // Aumentar intervalo a 2 segundos para reducir recargas
            ignored: ['**/node_modules/**', '**/.git/**']  // Ignorar carpetas innecesarias
        }
    },
    optimizeDeps: {
        include: ['@supabase/supabase-js'],  // Incluir en lugar de excluir para pre-bundling correcto
        force: true  // Forzar re-optimización
    },
    build: {
        chunkSizeWarningLimit: 1000,  // Aumentar límite de warning para archivos grandes
        commonjsOptions: {
            transformMixedEsModules: true  // Manejar módulos mixtos ES/CommonJS
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],  // Dividir dependencias grandes
                    radix: ['@radix-ui/react-*'],  // Dividir Radix UI en un chunk separado
                },
            },
        },
    },
})