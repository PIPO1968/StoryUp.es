-- Configuración de Base de Datos PostgreSQL para StoryUp
-- Ejecutar estos comandos en tu base de datos PostgreSQL

-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de historias
CREATE TABLE stories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200),
    content TEXT NOT NULL,
    image_url TEXT,
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'private')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de likes
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, story_id)
);

-- Tabla de comentarios
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mensajes para el chat
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender VARCHAR(50) NOT NULL,
    receiver VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de contactos para el chat
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    user_nick VARCHAR(50) NOT NULL,
    contact_nick VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_nick, contact_nick)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX idx_likes_story_id ON likes(story_id);
CREATE INDEX idx_comments_story_id ON comments(story_id);
CREATE INDEX idx_messages_sender_receiver ON messages(sender, receiver);
CREATE INDEX idx_contacts_user_nick ON contacts(user_nick);