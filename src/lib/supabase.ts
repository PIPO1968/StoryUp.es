import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from './supabase-config'

// Crear el cliente de Supabase
export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey)

// Tipos para la base de datos
export interface DatabaseUser {
    id: string
    username: string
    name: string
    email: string
    avatar?: string
    bio?: string
    user_type: 'user' | 'educator'
    school?: string
    grade?: string
    followers: number
    following: number
    trophies: string[]
    created_at: string
}

export interface DatabaseStory {
    id: string
    user_id: string
    content: string
    image?: string
    likes: number
    visibility: 'public' | 'friends' | 'private'
    created_at: string
}

export interface DatabaseComment {
    id: string
    story_id: string
    user_id: string
    content: string
    created_at: string
}

export interface DatabaseChatMessage {
    id: string
    sender_id: string
    receiver_id: string
    content: string
    is_read: boolean
    created_at: string
}