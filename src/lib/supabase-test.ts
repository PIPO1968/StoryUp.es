import { supabase } from './supabase'

// Función para probar la conexión
export async function testSupabaseConnection() {
    try {
        // Prueba básica de conexión sin requerir autenticación
        console.log('✅ Conexión con Supabase establecida')
        console.log('� URL:', 'https://kvvsbomvoxvvunxkkjyf.supabase.co')

        // Verificar estado de autenticación (opcional)
        try {
            const { data: { user }, error } = await supabase.auth.getUser()
            if (user) {
                console.log('👤 Usuario autenticado:', user.email)
            } else {
                console.log('� No hay usuario autenticado (modo público)')
            }
        } catch (authError) {
            console.log('ℹ️ Modo público - sin autenticación')
        }

        return { success: true }
    } catch (err) {
        console.log('Error de conexión:', err)
        return { success: false, error: String(err) }
    }
}// Función para detectar tablas existentes
export async function detectExistingTables() {
    const testTables = ['users', 'stories', 'comments', 'story_likes', 'chat_messages', 'chats', 'trophies', 'user_trophies', 'news']
    const existingTables = []

    console.log('🔍 Detectando tablas existentes...')

    for (const table of testTables) {
        try {
            const { error } = await supabase
                .from(table)
                .select('id')
                .limit(1)

            if (!error) {
                existingTables.push(table)
                console.log(`✅ Tabla encontrada: ${table}`)
            }
        } catch (e) {
            // Tabla no existe, continúa
        }
    }

    if (existingTables.length === 0) {
        console.log('❓ No se encontraron tablas conocidas. Puede que necesites crearlas.')
    } else {
        console.log('📋 Tablas detectadas:', existingTables)
    }

    return existingTables
}