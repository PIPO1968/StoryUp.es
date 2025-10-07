// Sistema de gestión de estadísticas de usuario para StoryUp.es

export interface UserLikes {
    fromStories: number;      // Likes de historias
    fromTrophies: number;     // Likes por conseguir trofeos
    fromContests: number;     // Likes por concursos (ganar/participar)
    fromAdmin: number;        // Likes premio de Padres/Docentes
    total: number;           // Suma de todos
}

export interface UserStats {
    userId: string;
    likes: UserLikes;
    friends: number;
    trophies: number;
    stories: number;
    globalPosition: number;
    lastUpdated: string;
}



// Obtener estadísticas de un usuario
export const getUserStats = (userId: string): UserStats => {
    // TODO: Reemplazar por llamada a la API/DB
    // Simulación temporal de datos por defecto
    return {
        userId,
        likes: { fromStories: 0, fromTrophies: 0, fromContests: 0, fromAdmin: 0, total: 0 },
        friends: 0,
        trophies: 0,
        stories: 0,
        globalPosition: 0,
        lastUpdated: new Date().toISOString()
    };
};

// Guardar estadísticas de usuario
export const saveUserStats = (stats: UserStats): void => {
    // TODO: Reemplazar por llamada a la API/DB
    stats.likes.total = stats.likes.fromStories + stats.likes.fromTrophies + stats.likes.fromContests + stats.likes.fromAdmin;
    stats.lastUpdated = new Date().toISOString();
    // Aquí iría la llamada a la API para guardar stats
};

// Añadir likes de historias
export const addStoryLikes = (userId: string, amount: number): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Añadir likes de trofeos
export const addTrophyLikes = (userId: string, amount: number): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Añadir likes de concursos
export const addContestLikes = (userId: string, amount: number): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Añadir likes de administración
export const addAdminLikes = (userId: string, amount: number): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Incrementar contador de amigos
export const addFriend = (userId: string): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Decrementar contador de amigos
export const removeFriend = (userId: string): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Incrementar contador de trofeos
export const addTrophy = (userId: string): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Incrementar contador de historias
export const addStory = (userId: string): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Decrementar contador de historias (si se elimina)
export const removeStory = (userId: string): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Actualizar ranking global
const updateGlobalRanking = (): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Guardar estadísticas sin actualizar ranking (para evitar bucle infinito)
const saveUserStatsWithoutRankingUpdate = (stats: UserStats): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Obtener ranking global
export const getGlobalRanking = (): UserStats[] => {
    // TODO: Reemplazar por llamada a la API/DB
    return [];
};

// Obtener top N usuarios
export const getTopUsers = (limit: number = 10): UserStats[] => {
    // TODO: Reemplazar por llamada a la API/DB
    return [];
};

// Resetear estadísticas de un usuario (para testing)
export const resetUserStats = (userId: string): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// ========== FUNCIONES AUTOMÁTICAS PARA ACCIONES REALES ==========

// Ejecutar cuando el usuario crea una historia real
export const onStoryCreated = (userId: string): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Ejecutar cuando el usuario recibe un like real en una historia
export const onStoryLiked = (userId: string, likesReceived: number = 1): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Ejecutar cuando el usuario gana un trofeo real
export const onTrophyEarned = (userId: string, trophyName: string): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Ejecutar cuando el usuario participa en un concurso
export const onContestParticipation = (userId: string): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Ejecutar cuando el usuario gana un concurso
export const onContestWin = (userId: string): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Ejecutar cuando un padre/docente da premio admin
export const onAdminAward = (userId: string, awardPoints: number = 5): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Ejecutar cuando el usuario hace un nuevo amigo
export const onFriendAdded = (userId: string, friendName: string): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Función para mostrar resumen de actividad del usuario
export const getUserActivitySummary = (userId: string): string => {
    // TODO: Reemplazar por llamada a la API/DB
    return `No disponible. Falta integración con API/DB.`;
};