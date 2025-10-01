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

// Refrescar el token de autenticación
export const refreshAuthToken = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
        console.error('Error refrescando el token de autenticación:', error);
        throw error;
    }
    console.log('Token de autenticación refrescado:', data);
    return data;
};