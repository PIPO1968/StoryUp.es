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
export const clearTestNewsData = (): void => {
    try {
        const news = localStorage.getItem('storyup_news');
        if (news) {
            const parsedNews = JSON.parse(news);
            // Solo mantener noticias válidas
            const validNews = parsedNews.filter((item: any) =>
                item &&
                item.id &&
                item.title &&
                item.content &&
                item.author &&
                item.author.id &&
                item.author.username &&
                item.author.role &&
                typeof item.likes === 'number' &&
                Array.isArray(item.likedBy) &&
                typeof item.views === 'number' &&
                item.createdAt
            ).map((item: any) => ({
                ...item,
                // Asignar valores por defecto para campos nuevos si no existen
                summary: item.summary || item.content.substring(0, 200) + '...',
                category: item.category || 'Educación',
                featured: item.featured || false
            }));

            if (validNews.length !== parsedNews.length) {
                localStorage.setItem('storyup_news', JSON.stringify(validNews));
                console.log('Noticias inválidas eliminadas, noticias válidas preservadas');
            }
        }
    } catch (error) {
        console.error('Error limpiando datos de noticias:', error);
    }
};

// Migrar noticias existentes para añadir campos nuevos
export const migrateNewsWithNewFields = (): void => {
    try {
        const news = localStorage.getItem('storyup_news');
        if (news) {
            const parsedNews = JSON.parse(news);
            let hasChanges = false;

            const migratedNews = parsedNews.map((item: any) => {
                // Si la noticia no tiene los campos nuevos, añadirlos
                if (!item.summary || !item.category || item.featured === undefined) {
                    hasChanges = true;
                    return {
                        ...item,
                        summary: item.summary || item.content.substring(0, 200) + '...',
                        category: item.category || 'Educación',
                        featured: item.featured || false,
                        views: item.views || 0
                    };
                }
                return item;
            });

            if (hasChanges) {
                localStorage.setItem('storyup_news', JSON.stringify(migratedNews));
                console.log('✅ Noticias migradas con nuevos campos');
            }
        }
    } catch (error) {
        console.error('Error migrando noticias:', error);
    }
};

// Obtener todas las noticias ordenadas por fecha (más recientes primero)
export const getAllNews = (): News[] => {
    try {
        const news = localStorage.getItem('storyup_news');
        if (news) {
            const parsedNews: News[] = JSON.parse(news);
            // Verificar que las noticias tengan la estructura correcta
            const validNews = parsedNews.filter(item =>
                item &&
                item.id &&
                item.title &&
                item.content &&
                item.author &&
                item.author.id &&
                item.author.username &&
                typeof item.likes === 'number' &&
                Array.isArray(item.likedBy) &&
                item.createdAt
            );

            // Ordenar por fecha de creación (más recientes primero)
            return validNews.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
        return [];
    } catch (error) {
        console.error('Error obteniendo noticias:', error);
        return [];
    }
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
    try {
        const news = getAllNews();
        const updatedNews = news.map(item =>
            item.id === newsId
                ? { ...item, views: item.views + 1, updatedAt: new Date().toISOString() }
                : item
        );
        localStorage.setItem('storyup_news', JSON.stringify(updatedNews));
    } catch (error) {
        console.error('Error incrementando vistas:', error);
    }
};

// Guardar nueva noticia
export const saveNews = async (newsData: Omit<News, 'id' | 'createdAt' | 'updatedAt'>): Promise<News> => {
    try {
        const newNews: News = {
            ...newsData,
            id: `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const existingNews = getAllNews();
        const updatedNews = [newNews, ...existingNews];

        localStorage.setItem('storyup_news', JSON.stringify(updatedNews));
        console.log('📰 Nueva noticia guardada:', newNews.title);

        return newNews;
    } catch (error) {
        console.error('Error guardando noticia:', error);
        throw error;
    }
};

// Toggle like en una noticia
export const toggleNewsLike = (newsId: string, userId: string): { liked: boolean; newLikeCount: number } => {
    try {
        const news = getAllNews();
        const newsIndex = news.findIndex(item => item.id === newsId);

        if (newsIndex === -1) {
            throw new Error('Noticia no encontrada');
        }

        const currentNews = news[newsIndex];
        const isLiked = currentNews.likedBy.includes(userId);

        let newLikedBy: string[];
        let newLikeCount: number;

        if (isLiked) {
            // Quitar like
            newLikedBy = currentNews.likedBy.filter(id => id !== userId);
            newLikeCount = currentNews.likes - 1;
        } else {
            // Añadir like
            newLikedBy = [...currentNews.likedBy, userId];
            newLikeCount = currentNews.likes + 1;
        }

        news[newsIndex] = {
            ...currentNews,
            likes: newLikeCount,
            likedBy: newLikedBy,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('storyup_news', JSON.stringify(news));

        return { liked: !isLiked, newLikeCount };
    } catch (error) {
        console.error('Error toggling like en noticia:', error);
        throw error;
    }
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