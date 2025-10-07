// Stub temporal para evitar errores de importación
export const clearTestNewsData = () => {
    // TODO: Implementar limpieza de noticias vía API/DB
    return null;
};
// Sistema de gestión de noticias para StoryUp.es

export interface News {
    id: string;
    title: string;
    content: string;
    summary: string; // Resumen breve para la lista
    author: {
        id: string;
        username: string;
        name?: string;
        role: 'admin' | 'teacher';
    };
    category: 'StoryUp' | 'Educación' | 'Tecnología' | 'Cultura' | 'Deportes' | 'Salud' | 'Comunidad';
    featured: boolean; // Si es noticia destacada
    likes: number;
    likedBy: string[]; // Array de IDs de usuarios que dieron like
    views: number;
    createdAt: string;
    updatedAt: string;
}

export interface NewsPreview {
    id: string;
    title: string;
    summary: string;
    category: string;
    featured: boolean;
    author: {
        id: string;
        username: string;
        name?: string;
        role: string;
    };
    likes: number;
    views: number;
    createdAt: string;
}

export interface NewsStats {
    totalNews: number;
    totalLikes: number;
    totalViews: number;
    featuredNews: News | null;
    mostViewedNews: News | null;
}

// Limpiar datos de prueba/ficticios (solo datos inválidos, no todas las noticias)


// Migrar noticias existentes para añadir campos nuevos
export const migrateNewsWithNewFields = (): void => {
    // Implementar migración de noticias vía API/DB
    throw new Error('migrateNewsWithNewFields debe implementarse con API/DB');
};

// Obtener todas las noticias ordenadas por fecha (más recientes primero)
export const getAllNews = (): News[] => {
    // TODO: Reemplazar por llamada a la API/DB
    return [];
};

// Obtener vista previa de noticias para la lista
export const getNewsPreview = (): NewsPreview[] => {
    const news = getAllNews();
    return news.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        category: item.category,
        featured: item.featured,
        author: item.author,
        likes: item.likes,
        views: item.views,
        createdAt: item.createdAt
    }));
};

// Obtener una noticia específica por ID
export const getNewsById = (newsId: string): News | null => {
    const news = getAllNews();
    const foundNews = news.find(item => item.id === newsId);

    // Incrementar vistas cuando se accede a la noticia
    if (foundNews) {
        incrementNewsViews(newsId);
        return { ...foundNews, views: foundNews.views + 1 };
    }

    return null;
};

// Incrementar vistas de una noticia
export const incrementNewsViews = (newsId: string): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Guardar nueva noticia
export const saveNews = async (newsData: Omit<News, 'id' | 'createdAt' | 'updatedAt'>): Promise<News> => {
    // TODO: Reemplazar por llamada a la API/DB
    return {
        ...newsData,
        id: `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
};

// Toggle like en una noticia
export const toggleNewsLike = (newsId: string, userId: string): { liked: boolean; newLikeCount: number } => {
    // TODO: Reemplazar por llamada a la API/DB
    return { liked: false, newLikeCount: 0 };
};

// Obtener estadísticas de noticias
export const getNewsStats = (): NewsStats => {
    try {
        const news = getAllNews();

        const totalNews = news.length;
        const totalLikes = news.reduce((sum, item) => sum + item.likes, 0);
        const totalViews = news.reduce((sum, item) => sum + item.views, 0);

        // Noticia destacada (featured = true) o la más reciente
        const featuredNews = news.find(item => item.featured) || news[0] || null;

        // Noticia más vista
        const mostViewedNews = news.reduce((prev, current) =>
            (current.views > (prev?.views || 0)) ? current : prev, null as News | null);

        return {
            totalNews,
            totalLikes,
            totalViews,
            featuredNews,
            mostViewedNews
        };
    } catch (error) {
        console.error('Error obteniendo estadísticas de noticias:', error);
        return {
            totalNews: 0,
            totalLikes: 0,
            totalViews: 0,
            featuredNews: null,
            mostViewedNews: null
        };
    }
};

// Obtener noticias por categoría
export const getNewsByCategory = (category: string): News[] => {
    const news = getAllNews();
    return news.filter(item => item.category === category);
};

// Obtener noticias destacadas
export const getFeaturedNews = (): News[] => {
    const news = getAllNews();
    return news.filter(item => item.featured);
};