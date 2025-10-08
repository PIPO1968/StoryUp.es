// Sistema de estadísticas reales de usuarios para StoryUp.es

export interface OnlineUser {
    userId: string;
    username: string;
    lastActive: number;
}

export interface UserStats {
    totalUsers: number;
    onlineUsers: number;
}

// Constante para el tiempo de inactividad (5 minutos)
const INACTIVE_THRESHOLD = 5 * 60 * 1000; // 5 minutos en milisegundos

// Obtener todos los usuarios registrados reales


// Obtener usuarios online reales (filtrados por actividad reciente)


// Marcar usuario como online/activo
export const markUserAsOnline = (userId: string, username: string): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Obtener estadísticas completas
export const getUserStats = async (): Promise<UserStats> => {
    try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('No se pudo obtener el número de usuarios');
        const data = await res.json();
        return {
            totalUsers: data.total || 0,
            onlineUsers: 0 // Si tienes endpoint para online, aquí se puede consultar
        };
    } catch (error) {
        console.error('Error obteniendo estadísticas de usuarios:', error);
        return {
            totalUsers: 0,
            onlineUsers: 0
        };
    }
};

// Limpiar usuarios inactivos
export const cleanupInactiveUsers = (): void => {
    // TODO: Reemplazar por llamada a la API/DB
};