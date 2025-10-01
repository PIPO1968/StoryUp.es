-- Script para deshabilitar RLS y permitir acceso completo (SOLO PARA DESARROLLO)
-- Ejecutar en SQL Editor de https://kvvsbomvoxvvunxkkjyf.supabase.co

-- Deshabilitar RLS en las tablas principales
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;

-- Verificar que se deshabilitó correctamente
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('users', 'chat_messages');

-- Insertar usuarios de prueba si no existen
INSERT INTO users (id, username, name, email, user_type) VALUES
('1', 'PIPO68', 'PIPO68', 'pipocanarias@hotmail.com', 'usuario'),
('2', 'Admin', 'Admin', 'piporgz68@gmail.com', 'padre-docente')
ON CONFLICT (id) DO NOTHING;

-- Verificar que los usuarios se insertaron
SELECT * FROM users;

-- Si las tablas no existen, crearlas primero:
-- (Descomenta solo si las tablas no existen)

/*
-- Crear tabla users
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,  
    email TEXT UNIQUE NOT NULL,
    user_type TEXT CHECK (user_type IN ('usuario', 'padre-docente')) DEFAULT 'usuario',
    avatar TEXT,
    bio TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla chat_messages
CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    receiver_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar usuarios de prueba
INSERT INTO users (id, username, name, email, user_type) VALUES
('1', 'PIPO68', 'PIPO68', 'pipocanarias@hotmail.com', 'usuario'),
('2', 'Admin', 'Admin', 'piporgz68@gmail.com', 'padre-docente');
*/

-- Verificar que las tablas existen
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';