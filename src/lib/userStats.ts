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
// Eliminado: obtención de usuarios totales desde localStorage. Usar API/DB.

// Obtener usuarios online reales (filtrados por actividad reciente)
// Eliminado: obtención de usuarios online desde localStorage. Usar API/DB.

// Marcar usuario como online/activo
export const markUserAsOnline = (userId: string, username: string): void => {
    try {
        const onlineUsers = getActiveOnlineUsers();
        const currentTimestamp = Date.now();

        // Buscar si el usuario ya está en la lista
        const userIndex = onlineUsers.findIndex(userData =>
            userData.userId === userId || userData.username === username
        );

        if (userIndex >= 0) {
            // Actualizar timestamp del usuario existente
            onlineUsers[userIndex].lastActive = currentTimestamp;
        } else {
            // Agregar nuevo usuario online
            onlineUsers.push({
                userId,
                username,
                lastActive: currentTimestamp
            });
        }

        localStorage.setItem('storyup_online_users', JSON.stringify(onlineUsers));
    } catch (error) {
        console.error('Error marcando usuario como online:', error);
    }
};

// Obtener estadísticas completas
export const getUserStats = (): UserStats => {
    const totalUsers = getTotalRegisteredUsers();
    const onlineUsers = getActiveOnlineUsers().length;

    return {
        totalUsers,
        onlineUsers
    };
};

// Limpiar usuarios inactivos
export const cleanupInactiveUsers = (): void => {
    getActiveOnlineUsers(); // Esta función ya limpia automáticamente
};