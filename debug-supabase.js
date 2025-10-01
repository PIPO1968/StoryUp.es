import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kvvsbomvoxvvunxkkjyf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dnNib212b3h2dnVueGtranlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzI4NjIsImV4cCI6MjA3NDY0ODg2Mn0.DSriZyytXiCDbutr6XJyV-0DAQh87G5EEVUOR2IvZ8k'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugSupabase() {
    console.log('🔍 Debuggeando problema de Supabase...')

    try {
        console.log('1. Probando conexión básica...')
        const { data, error } = await supabase.from('users').select('count')
        console.log('✅ Conexión básica:', { data, error })

        console.log('2. Probando listar tablas...')
        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
        console.log('📋 Tablas disponibles:', { tables, tablesError })

        console.log('3. Probando consulta simple a users...')
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .limit(1)
        console.log('👥 Consulta users:', { users, usersError })

        console.log('4. Probando inserción de usuario test...')
        const testUser = {
            id: 'test-' + Date.now(),
            email: 'test@example.com',
            name: 'Test User',
            username: 'testuser',
            user_type: 'usuario'
        }

        const { data: insertResult, error: insertError } = await supabase
            .from('users')
            .insert([testUser])
            .select()
        console.log('📝 Inserción test:', { insertResult, insertError })

        // Si la inserción fue exitosa, eliminar el usuario test
        if (insertResult && insertResult.length > 0) {
            const { error: deleteError } = await supabase
                .from('users')
                .delete()
                .eq('id', testUser.id)
            console.log('🗑️ Eliminación test:', { deleteError })
        }

    } catch (error) {
        console.error('❌ Error general:', error)
    }
}

debugSupabase()