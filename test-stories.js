// Test rápido para verificar tabla stories
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kvvsbomvoxvvunxkkjyf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dnNib212b3h2dnVueGtranlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzI4NjIsImV4cCI6MjA3NDY0ODg2Mn0.DSriZyytXiCDbutr6XJyV-0DAQh87G5EEVUOR2IvZ8k'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testStoryInsert() {
    console.log('🧪 Investigando estructura de tabla stories...')

    try {
        // Intentar hacer una query vacía para ver la estructura
        const { data, error } = await supabase
            .from('stories')
            .select('*')
            .limit(0)  // No traer datos, solo estructura

        if (error) {
            console.error('❌ Error con query vacía:', error)
        } else {
            console.log('✅ Query vacía exitosa')
            console.log('📋 Data vacía:', data)
        }

        // Intentar obtener metadata desde el resto API directamente
        console.log('🔍 Intentando obtener schema info...')

        // Hacer una consulta HTTP directa para ver el error más detallado
        const response = await fetch(
            'https://kvvsbomvoxvvunxkkjyf.supabase.co/rest/v1/stories',
            {
                method: 'GET',
                headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dnNib212b3h2dnVueGtranlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzI4NjIsImV4cCI6MjA3NDY0ODg2Mn0.DSriZyytXiCDbutr6XJyV-0DAQh87G5EEVUOR2IvZ8k',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dnNib212b3h2dnVueGtranlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzI4NjIsImV4cCI6MjA3NDY0ODg2Mn0.DSriZyytXiCDbutr6XJyV-0DAQh87G5EEVUOR2IvZ8k',
                    'Range': '0-0'
                }
            }
        );

        if (response.ok) {
            const result = await response.json();
            console.log('🎯 Respuesta HTTP directa:', result);

            if (result && result.length > 0) {
                console.log('� Columnas disponibles:', Object.keys(result[0]));
            }
        } else {
            console.log('❌ Error HTTP:', response.status, response.statusText);
            const errorText = await response.text();
            console.log('Error details:', errorText);
        }

    } catch (error) {
        console.error('💥 Error general:', error)
    }
} testStoryInsert()