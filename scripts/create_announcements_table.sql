-- Crear tabla announcements
CREATE TABLE announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row-Level Security (RLS)
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos los usuarios
CREATE POLICY "Allow read access to all" ON announcements
    FOR SELECT
    USING (true);

-- Política para permitir escritura a usuarios autenticados
CREATE POLICY "Allow insert access to authenticated users" ON announcements
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);