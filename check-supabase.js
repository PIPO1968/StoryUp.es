// Script para verificar estado de la tabla messages en Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://abvjvxzvdazjckuvrhsm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFidmp2eHp2ZGF6amNrdXZyaHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc1MjEwODEsImV4cCI6MjA0MzA5NzA4MX0.iKgmdstLmckPuQ8kDXg4mJt5kQCR6Xp9v9lD8CUU5kY'
const supabase = createClient(supabaseUrl, supabaseKey)

// Verificar tablas existentes
async function checkTables() {
    console.log('🔍 Verificando tablas en Supabase...')

    // Listar todas las tablas
    try {
        const { data: tables, error } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')

        if (error) {
            console.log('❌ Error listando tablas:', error)
        } else {
            console.log('📋 Tablas encontradas:', tables)
        }
    } catch (err) {
        console.log('❌ Error:', err)
    }

    // Verificar tabla messages específicamente
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('count', { count: 'exact', head: true })

        if (error) {
            console.log('❌ Tabla messages NO existe:', error.message)
        } else {
            console.log('✅ Tabla messages SÍ existe')
        }
    } catch (err) {
        console.log('❌ Error verificando messages:', err)
    }

    // Verificar usuarios
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count', { count: 'exact', head: true })

        if (error) {
            console.log('❌ Tabla users NO existe:', error.message)
        } else {
            console.log('✅ Tabla users SÍ existe')
        }
    } catch (err) {
        console.log('❌ Error verificando users:', err)
    }
}

checkTables()