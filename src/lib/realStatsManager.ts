// Sistema de estadísticas reales para StoryUp.es
import { getStoredUsers } from './auth';
import { getAllStories } from './storiesManager';
import { getAllNews } from './newsManager';

export interface UserStats {
    totalUsers: number;
    usersByRole: {
        teacher: number; // Incluye tanto Admin como Padre/Docente
        user: number;
    };
    activeUsers: number;
    newUsersThisMonth: number;
    topContributors: {
        id: string;
        username: string;
        name: string;
        contributions: number;
        likes: number;
    }[];
}

export interface StoryStats {
    totalStories: number;
    storiesByType: {
        Real: number;
        Ficticia: number;
    };
    storiesByTheme: {
        Aventura: number;
        Fantasía: number;
        Corazón: number;
        Terror: number;
        Educativa: number;
        CONCURSO: number;
    };
    totalLikes: number;
    averageLikes: number;
    mostPopularStory: {
        id: string;
        title: string;
        likes: number;
        author: string;
    } | null;
    recentTrends: {
        thisWeek: number;
        thisMonth: number;
    };
}

export interface NewsStats {
    totalNews: number;
    newsByCategory: {
        StoryUp: number;
        Educación: number;
        Tecnología: number;
        Cultura: number;
        Deportes: number;
        Salud: number;
        Comunidad: number;
    };
    totalViews: number;
    totalLikes: number;
    featuredCount: number;
    averageEngagement: number;
    mostViewedNews: {
        id: string;
        title: string;
        views: number;
        category: string;
    } | null;
}

export interface EngagementStats {
    totalLikes: number;
    likesDistribution: {
        stories: number;
        news: number;
    };
    mostActiveUsers: {
        id: string;
        username: string;
        totalLikes: number;
        storiesLiked: number;
        newsLiked: number;
    }[];
    dailyActivity: {
        today: number;
        yesterday: number;
        thisWeek: number;
    };
}

export interface ContestStats {
    totalContests: number;
    activeContests: number;
    totalParticipants: number;
    contestsByTheme: {
        [key: string]: number;
    };
    winners: {
        id: string;
        username: string;
        contestName: string;
        date: string;
    }[];
}

export interface EducationalCenterStats {
    totalCenters: number;
    centersByType: {
        primary: number;
        secondary: number;
        university: number;
        other: number;
    };
    mostActiveCenters: {
        name: string;
        userCount: number;
        storiesCount: number;
        newsCount: number;
    }[];
    teacherCount: number;
    studentCount: number;
}

export interface PlatformStats {
    totalContent: number;
    dailyActiveUsers: number;
    monthlyGrowth: number;
    engagementRate: number;
    platformHealth: {
        contentCreation: 'high' | 'medium' | 'low';
        userActivity: 'high' | 'medium' | 'low';
        communityEngagement: 'high' | 'medium' | 'low';
    };
    timeline: {
        date: string;
        users: number;
        stories: number;
        news: number;
        likes: number;
    }[];
}

// Obtener estadísticas de usuarios
export const getUserStats = async (): Promise<UserStats> => {
    try {
        const users = await getStoredUsers();
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const usersByRole = {
            teacher: users.filter(u => u.role === 'admin' || u.role === 'teacher').length,
            user: users.filter(u => u.role === 'user').length,
        };

        const newUsersThisMonth = users.filter(u =>
            new Date(u.createdAt) >= thisMonth
        ).length;

        // Calcular contribuciones (historias + noticias por usuario)
        const stories = getAllStories();
        const news = getAllNews();

        const contributions = users.map(user => {
            const userStories = stories.filter(s => s.author.id === user.id).length;
            const userNews = news.filter(n => n.author.id === user.id).length;
            const userLikes = stories
                .filter(s => s.author.id === user.id)
                .reduce((sum, s) => sum + s.likes, 0) +
                news
                    .filter(n => n.author.id === user.id)
                    .reduce((sum, n) => sum + n.likes, 0);

            return {
                id: user.id,
                username: user.username,
                name: user.name || user.username,
                contributions: userStories + userNews,
                likes: userLikes
            };
        });

        const topContributors = contributions
            .filter(c => c.contributions > 0)
            .sort((a, b) => b.contributions - a.contributions)
            .slice(0, 5);

        return {
            totalUsers: users.length,
            usersByRole,
            activeUsers: users.filter(u => u.isOnline).length,
            newUsersThisMonth,
            topContributors
        };
    } catch (error) {
        console.error('Error getting user stats:', error);
        return {
            totalUsers: 0,
            usersByRole: { teacher: 0, user: 0 },
            activeUsers: 0,
            newUsersThisMonth: 0,
            topContributors: []
        };
    }
};

// Obtener estadísticas de historias
export const getStoryStats = (): StoryStats => {
    try {
        const stories = getAllStories();
        const now = new Date();
        const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const storiesByType = {
            Real: stories.filter(s => s.type === 'Real').length,
            Ficticia: stories.filter(s => s.type === 'Ficticia').length,
        };

        const storiesByTheme = {
            Aventura: stories.filter(s => s.theme === 'Aventura').length,
            Fantasía: stories.filter(s => s.theme === 'Fantasía').length,
            Corazón: stories.filter(s => s.theme === 'Corazón').length,
            Terror: stories.filter(s => s.theme === 'Terror').length,
            Educativa: stories.filter(s => s.theme === 'Educativa').length,
            CONCURSO: stories.filter(s => s.theme === 'CONCURSO').length,
        };

        const totalLikes = stories.reduce((sum, s) => sum + s.likes, 0);
        const averageLikes = stories.length > 0 ? totalLikes / stories.length : 0;

        const mostPopularStory = stories.length > 0
            ? stories.reduce((prev, current) =>
                current.likes > prev.likes ? current : prev
            ) : null;

        const recentTrends = {
            thisWeek: stories.filter(s => new Date(s.createdAt) >= thisWeek).length,
            thisMonth: stories.filter(s => new Date(s.createdAt) >= thisMonth).length,
        };

        return {
            totalStories: stories.length,
            storiesByType,
            storiesByTheme,
            totalLikes,
            averageLikes: Math.round(averageLikes * 10) / 10,
            mostPopularStory: mostPopularStory ? {
                id: mostPopularStory.id,
                title: mostPopularStory.title,
                likes: mostPopularStory.likes,
                author: mostPopularStory.author.name || mostPopularStory.author.username
            } : null,
            recentTrends
        };
    } catch (error) {
        console.error('Error getting story stats:', error);
        return {
            totalStories: 0,
            storiesByType: { Real: 0, Ficticia: 0 },
            storiesByTheme: { Aventura: 0, Fantasía: 0, Corazón: 0, Terror: 0, Educativa: 0, CONCURSO: 0 },
            totalLikes: 0,
            averageLikes: 0,
            mostPopularStory: null,
            recentTrends: { thisWeek: 0, thisMonth: 0 }
        };
    }
};

// Obtener estadísticas de noticias
export const getNewsStatsDetailed = (): NewsStats => {
    try {
        const news = getAllNews();

        const newsByCategory = {
            StoryUp: news.filter(n => n.category === 'StoryUp').length,
            Educación: news.filter(n => n.category === 'Educación').length,
            Tecnología: news.filter(n => n.category === 'Tecnología').length,
            Cultura: news.filter(n => n.category === 'Cultura').length,
            Deportes: news.filter(n => n.category === 'Deportes').length,
            Salud: news.filter(n => n.category === 'Salud').length,
            Comunidad: news.filter(n => n.category === 'Comunidad').length,
        };

        const totalViews = news.reduce((sum, n) => sum + n.views, 0);
        const totalLikes = news.reduce((sum, n) => sum + n.likes, 0);
        const featuredCount = news.filter(n => n.featured).length;
        const averageEngagement = news.length > 0 ? (totalLikes + totalViews) / news.length : 0;

        const mostViewedNews = news.length > 0
            ? news.reduce((prev, current) =>
                current.views > prev.views ? current : prev
            ) : null;

        return {
            totalNews: news.length,
            newsByCategory,
            totalViews,
            totalLikes,
            featuredCount,
            averageEngagement: Math.round(averageEngagement * 10) / 10,
            mostViewedNews: mostViewedNews ? {
                id: mostViewedNews.id,
                title: mostViewedNews.title,
                views: mostViewedNews.views,
                category: mostViewedNews.category
            } : null
        };
    } catch (error) {
        console.error('Error getting news stats:', error);
        return {
            totalNews: 0,
            newsByCategory: { StoryUp: 0, Educación: 0, Tecnología: 0, Cultura: 0, Deportes: 0, Salud: 0, Comunidad: 0 },
            totalViews: 0,
            totalLikes: 0,
            featuredCount: 0,
            averageEngagement: 0,
            mostViewedNews: null
        };
    }
};

// Obtener estadísticas de engagement
export const getEngagementStats = async (): Promise<EngagementStats> => {
    try {
        const stories = getAllStories();
        const news = getAllNews();
        const users = await getStoredUsers();

        const totalLikes = stories.reduce((sum, s) => sum + s.likes, 0) +
            news.reduce((sum, n) => sum + n.likes, 0);

        const likesDistribution = {
            stories: stories.reduce((sum, s) => sum + s.likes, 0),
            news: news.reduce((sum, n) => sum + n.likes, 0)
        };

        // Calcular usuarios más activos en dar likes
        const mostActiveUsers = users.map(user => {
            const storiesLiked = stories.filter(s => s.likedBy.includes(user.id)).length;
            const newsLiked = news.filter(n => n.likedBy.includes(user.id)).length;

            return {
                id: user.id,
                username: user.username,
                totalLikes: storiesLiked + newsLiked,
                storiesLiked,
                newsLiked
            };
        })
            .filter(u => u.totalLikes > 0)
            .sort((a, b) => b.totalLikes - a.totalLikes)
            .slice(0, 5);

        // Actividad diaria (simulada por ahora)
        const dailyActivity = {
            today: Math.floor(totalLikes * 0.1),
            yesterday: Math.floor(totalLikes * 0.08),
            thisWeek: Math.floor(totalLikes * 0.3)
        };

        return {
            totalLikes,
            likesDistribution,
            mostActiveUsers,
            dailyActivity
        };
    } catch (error) {
        console.error('Error getting engagement stats:', error);
        return {
            totalLikes: 0,
            likesDistribution: { stories: 0, news: 0 },
            mostActiveUsers: [],
            dailyActivity: { today: 0, yesterday: 0, thisWeek: 0 }
        };
    }
};

// Obtener estadísticas de centros educativos
export const getEducationalCenterStats = async (): Promise<EducationalCenterStats> => {
    try {
        const users = await getStoredUsers();

        // Contar usuarios por rol real
        const teacherCount = users.filter(u => u.role === 'admin' || u.role === 'teacher').length;
        const userCount = users.filter(u => u.role === 'user').length;

        // No tenemos sistema de centros implementado, devolver datos reales disponibles
        return {
            totalCenters: 0, // No hay sistema de centros implementado
            centersByType: {
                primary: 0,
                secondary: 0,
                university: 0,
                other: 0
            },
            mostActiveCenters: [], // No hay centros registrados
            teacherCount,
            studentCount: userCount
        };
    } catch (error) {
        console.error('Error getting educational center stats:', error);
        return {
            totalCenters: 0,
            centersByType: { primary: 0, secondary: 0, university: 0, other: 0 },
            mostActiveCenters: [],
            teacherCount: 0,
            studentCount: 0
        };
    }
};

// Obtener estadísticas generales de la plataforma
export const getPlatformStats = async (): Promise<PlatformStats> => {
    try {
        const stories = getAllStories();
        const news = getAllNews();
        const users = await getStoredUsers();

        const totalContent = stories.length + news.length;
        const totalLikes = stories.reduce((sum, s) => sum + s.likes, 0) +
            news.reduce((sum, n) => sum + n.likes, 0);

        const engagementRate = totalContent > 0 ? (totalLikes / totalContent) * 100 : 0;

        // Calcular salud de la plataforma
        const contentCreation = totalContent > 20 ? 'high' : totalContent > 5 ? 'medium' : 'low';
        const userActivity = users.filter(u => u.isOnline).length > users.length * 0.3 ? 'high' : 'medium';
        const communityEngagement = engagementRate > 50 ? 'high' : engagementRate > 20 ? 'medium' : 'low';

        return {
            totalContent,
            dailyActiveUsers: users.filter(u => u.isOnline).length,
            monthlyGrowth: Math.floor(Math.random() * 15) + 5, // Simulado
            engagementRate: Math.round(engagementRate * 10) / 10,
            platformHealth: {
                contentCreation,
                userActivity,
                communityEngagement
            },
            timeline: [] // Se puede implementar más adelante
        };
    } catch (error) {
        console.error('Error getting platform stats:', error);
        return {
            totalContent: 0,
            dailyActiveUsers: 0,
            monthlyGrowth: 0,
            engagementRate: 0,
            platformHealth: {
                contentCreation: 'low',
                userActivity: 'low',
                communityEngagement: 'low'
            },
            timeline: []
        };
    }
};

// Obtener todas las estadísticas de una vez
export const getAllStats = async () => {
    return {
        users: await getUserStats(),
        stories: getStoryStats(),
        news: getNewsStatsDetailed(),
        engagement: await getEngagementStats(),
        centers: await getEducationalCenterStats(),
        platform: await getPlatformStats()
    };
};