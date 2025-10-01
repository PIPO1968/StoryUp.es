-- Schema completo para el nuevo proyecto Supabase
-- Ejecutar en SQL Editor después de crear el proyecto

-- 1. Tabla de usuarios
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

-- 2. Tabla de mensajes de chat
CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    receiver_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insertar usuarios de prueba
INSERT INTO users (id, username, name, email, user_type) VALUES
('1', 'PIPO68', 'PIPO68', 'pipocanarias@hotmail.com', 'usuario'),
('2', 'Admin', 'Admin', 'piporgz68@gmail.com', 'padre-docente');

-- 4. Crear índices para mejor performance
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_receiver ON chat_messages(receiver_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- 5. Comentarios
COMMENT ON TABLE users IS 'Tabla de usuarios del sistema';
COMMENT ON TABLE chat_messages IS 'Tabla de mensajes del chat';