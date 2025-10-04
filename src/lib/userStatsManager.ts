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

// Clave base para localStorage
const STATS_KEY = 'storyup_user_stats';
const GLOBAL_RANKING_KEY = 'storyup_global_ranking';

// Obtener estadísticas de un usuario
export const getUserStats = (userId: string): UserStats => {
    try {
        const stats = localStorage.getItem(`${STATS_KEY}_${userId}`);
        if (stats) {
            return JSON.parse(stats);
        }
        
        // Estadísticas por defecto para usuario nuevo
        const defaultStats: UserStats = {
            userId,
            likes: {
                fromStories: 0,
                fromTrophies: 0,
                fromContests: 0,
                fromAdmin: 0,
                total: 0
            },
            friends: 0,
            trophies: 0,
            stories: 0,
            globalPosition: 0,
            lastUpdated: new Date().toISOString()
        };
        
        saveUserStats(defaultStats);
        return defaultStats;
    } catch (error) {
        console.error('Error loading user stats:', error);
        return {
            userId,
            likes: { fromStories: 0, fromTrophies: 0, fromContests: 0, fromAdmin: 0, total: 0 },
            friends: 0,
            trophies: 0,
            stories: 0,
            globalPosition: 0,
            lastUpdated: new Date().toISOString()
        };
    }
};

// Guardar estadísticas de usuario
export const saveUserStats = (stats: UserStats): void => {
    try {
        // Recalcular total de likes
        stats.likes.total = stats.likes.fromStories + stats.likes.fromTrophies + 
                           stats.likes.fromContests + stats.likes.fromAdmin;
        
        stats.lastUpdated = new Date().toISOString();
        localStorage.setItem(`${STATS_KEY}_${stats.userId}`, JSON.stringify(stats));
        
        // Actualizar ranking global después de guardar
        updateGlobalRanking();
    } catch (error) {
        console.error('Error saving user stats:', error);
    }
};

// Añadir likes de historias
export const addStoryLikes = (userId: string, amount: number): void => {
    const stats = getUserStats(userId);
    stats.likes.fromStories += amount;
    saveUserStats(stats);
};

// Añadir likes de trofeos
export const addTrophyLikes = (userId: string, amount: number): void => {
    const stats = getUserStats(userId);
    stats.likes.fromTrophies += amount;
    saveUserStats(stats);
};

// Añadir likes de concursos
export const addContestLikes = (userId: string, amount: number): void => {
    const stats = getUserStats(userId);
    stats.likes.fromContests += amount;
    saveUserStats(stats);
};

// Añadir likes de administración
export const addAdminLikes = (userId: string, amount: number): void => {
    const stats = getUserStats(userId);
    stats.likes.fromAdmin += amount;
    saveUserStats(stats);
};

// Incrementar contador de amigos
export const addFriend = (userId: string): void => {
    const stats = getUserStats(userId);
    stats.friends += 1;
    saveUserStats(stats);
};

// Decrementar contador de amigos
export const removeFriend = (userId: string): void => {
    const stats = getUserStats(userId);
    stats.friends = Math.max(0, stats.friends - 1);
    saveUserStats(stats);
};

// Incrementar contador de trofeos
export const addTrophy = (userId: string): void => {
    const stats = getUserStats(userId);
    stats.trophies += 1;
    saveUserStats(stats);
};

// Incrementar contador de historias
export const addStory = (userId: string): void => {
    const stats = getUserStats(userId);
    stats.stories += 1;
    saveUserStats(stats);
};

// Decrementar contador de historias (si se elimina)
export const removeStory = (userId: string): void => {
    const stats = getUserStats(userId);
    stats.stories = Math.max(0, stats.stories - 1);
    saveUserStats(stats);
};

// Actualizar ranking global
const updateGlobalRanking = (): void => {
    try {
        // Obtener todos los usuarios con estadísticas
        const allUsers: UserStats[] = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STATS_KEY + '_')) {
                const stats = localStorage.getItem(key);
                if (stats) {
                    allUsers.push(JSON.parse(stats));
                }
            }
        }
        
        // Ordenar por total de likes (descendente)
        allUsers.sort((a, b) => b.likes.total - a.likes.total);
        
        // Asignar posiciones y guardar
        allUsers.forEach((user, index) => {
            user.globalPosition = index + 1;
            saveUserStatsWithoutRankingUpdate(user);
        });
        
        // Guardar ranking global
        localStorage.setItem(GLOBAL_RANKING_KEY, JSON.stringify(allUsers));
        
    } catch (error) {
        console.error('Error updating global ranking:', error);
    }
};

// Guardar estadísticas sin actualizar ranking (para evitar bucle infinito)
const saveUserStatsWithoutRankingUpdate = (stats: UserStats): void => {
    try {
        stats.likes.total = stats.likes.fromStories + stats.likes.fromTrophies + 
                           stats.likes.fromContests + stats.likes.fromAdmin;
        stats.lastUpdated = new Date().toISOString();
        localStorage.setItem(`${STATS_KEY}_${stats.userId}`, JSON.stringify(stats));
    } catch (error) {
        console.error('Error saving user stats:', error);
    }
};

// Obtener ranking global
export const getGlobalRanking = (): UserStats[] => {
    try {
        const ranking = localStorage.getItem(GLOBAL_RANKING_KEY);
        return ranking ? JSON.parse(ranking) : [];
    } catch (error) {
        console.error('Error loading global ranking:', error);
        return [];
    }
};

// Obtener top N usuarios
export const getTopUsers = (limit: number = 10): UserStats[] => {
    const ranking = getGlobalRanking();
    return ranking.slice(0, limit);
};

// Resetear estadísticas de un usuario (para testing)
export const resetUserStats = (userId: string): void => {
    localStorage.removeItem(`${STATS_KEY}_${userId}`);
    updateGlobalRanking();
};