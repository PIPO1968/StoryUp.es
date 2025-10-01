-- Script para arreglar el problema de UUID
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Eliminar las tablas existentes y recrearlas con TEXT IDs
DROP TABLE IF EXISTS user_trophies CASCADE;
DROP TABLE IF EXISTS story_likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS chats CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS trophies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Recrear tabla de usuarios con TEXT ID
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar TEXT,
    bio TEXT DEFAULT '',
    user_type TEXT CHECK (user_type IN ('user', 'educator')) DEFAULT 'user',
    school TEXT,
    grade TEXT,
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0,
    trophies TEXT[] DEFAULT '{}',
    favorites TEXT[] DEFAULT '{}',
    friends TEXT[] DEFAULT '{}',
    banned_words TEXT[] DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Recrear tabla de historias
CREATE TABLE stories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image TEXT,
    likes INTEGER DEFAULT 0,
    visibility TEXT CHECK (visibility IN ('public', 'friends', 'private')) DEFAULT 'public',
    is_news BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Recrear tabla de comentarios
CREATE TABLE comments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    story_id TEXT REFERENCES stories(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Recrear tabla de likes en historias
CREATE TABLE story_likes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    story_id TEXT REFERENCES stories(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(story_id, user_id)
);

-- 6. Recrear tabla de mensajes de chat
CREATE TABLE chat_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    sender_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    receiver_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    formatting JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Recrear tabla de chats
CREATE TABLE chats (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    participants TEXT[] NOT NULL,
    last_message_id TEXT REFERENCES chat_messages(id),
    is_private BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Recrear tabla de trofeos
CREATE TABLE trophies (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    category TEXT CHECK (category IN ('academic', 'social', 'participation', 'behavior')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Recrear tabla de trofeos ganados por usuarios
CREATE TABLE user_trophies (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    trophy_id TEXT REFERENCES trophies(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, trophy_id)
);

-- 10. Recrear tabla de noticias
CREATE TABLE news (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    creator_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recrear índices
CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX idx_comments_story_id ON comments(story_id);
CREATE INDEX idx_chat_messages_sender_receiver ON chat_messages(sender_id, receiver_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Recrear función y triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();