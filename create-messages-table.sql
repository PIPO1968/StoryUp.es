-- Crear tabla messages para el sistema de chat
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    from_user TEXT NOT NULL,
    to_user TEXT NOT NULL,
    message_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar performance
CREATE INDEX idx_messages_from_user ON messages(from_user);
CREATE INDEX idx_messages_to_user ON messages(to_user);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Comentarios para documentación
COMMENT ON TABLE messages IS 'Tabla para almacenar mensajes del sistema de chat';
COMMENT ON COLUMN messages.from_user IS 'Usuario que envía el mensaje';
COMMENT ON COLUMN messages.to_user IS 'Usuario que recibe el mensaje';
COMMENT ON COLUMN messages.message_text IS 'Contenido del mensaje';
COMMENT ON COLUMN messages.created_at IS 'Fecha y hora de creación del mensaje';