import { supabase } from './supabase';

// Obtener el usuario actual
export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        console.error('Error obteniendo el usuario actual:', error);
        return null;
    }
    return user;
};

// Actualizar datos del usuario
export const updateUser = async (updates: Partial<any>) => {
    const { data, error } = await supabase.from('users').update(updates).eq('id', updates.id);
    if (error) {
        console.error('Error actualizando el usuario:', error);
        throw error;
    }
    return data;
};