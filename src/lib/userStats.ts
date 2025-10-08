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
export const markUserAsOnline = (userId: string): void => {
    if (!userId) return;
    fetch('/api/online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    });
};

// Obtener estadísticas completas
export const getUserStats = async (): Promise<UserStats> => {
    try {
        const resUsers = await fetch('/api/users');
        const resOnline = await fetch('/api/online');
        let total = 0, online = 0;
        if (resUsers.ok) {
            const data = await resUsers.json();
            total = data.total || 0;
        }
        if (resOnline.ok) {
            const data = await resOnline.json();
            online = data.onlineCount || 0;
        }
        return {
            totalUsers: total,
            onlineUsers: online
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