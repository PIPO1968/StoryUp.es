// Sistema de gestión de historias para StoryUp.es

export interface Story {
    id: string;
    title: string;
    content: string;
    type: 'Real' | 'Ficticia'; // Tipo de historia
    theme: 'Aventura' | 'Fantasía' | 'Corazón' | 'Terror' | 'Educativa' | 'CONCURSO'; // Tema de la historia
    author: {
        id: string;
        username: string;
        name?: string;
    };
    likes: number;
    likedBy: string[]; // Array de IDs de usuarios que dieron like
    createdAt: string;
    updatedAt: string;
}

export interface StoryPreview {
    id: string;
    title: string;
    type: 'Real' | 'Ficticia';
    theme: 'Aventura' | 'Fantasía' | 'Corazón' | 'Terror' | 'Educativa' | 'CONCURSO';
    author: {
        id: string;
        username: string;
        name?: string;
    };
    likes: number;
    createdAt: string;
}

// Migrar historias existentes para añadir campos nuevos
export const migrateStoriesWithNewFields = (): void => {
    // Implementar migración de historias vía API/DB
    throw new Error('migrateStoriesWithNewFields debe implementarse con API/DB');
};


// Limpiar datos de prueba/ficticios (solo datos inválidos, no todas las historias)
export const clearTestData = (): void => {
    // Implementar limpieza de historias vía API/DB
    throw new Error('clearTestData debe implementarse con API/DB');
};


// Obtener todas las historias ordenadas por fecha (más recientes primero)
export const getAllStories = (): Story[] => {
    // TODO: Reemplazar por llamada a la API/DB
    return [];
};

// Obtener vista previa de historias para la lista
export const getStoriesPreview = (): StoryPreview[] => {
    const stories = getAllStories();
    return stories.map(story => ({
        id: story.id,
        title: story.title,
        type: story.type,
        theme: story.theme,
        author: story.author,
        likes: story.likes,
        createdAt: story.createdAt
    }));
};

// Obtener una historia específica por ID
export const getStoryById = (storyId: string): Story | null => {
    const stories = getAllStories();
    return stories.find(story => story.id === storyId) || null;
};

// Guardar una nueva historia
export const saveStory = (story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>): Story => {
    // TODO: Reemplazar por llamada a la API/DB
    return {
        ...story,
        id: generateStoryId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
};

// Dar/quitar like a una historia
export const toggleStoryLike = (storyId: string, userId: string): Story | null => {
    // TODO: Reemplazar por llamada a la API/DB
    return null;
};

// Verificar si un usuario ha dado like a una historia
export const hasUserLikedStory = (storyId: string, userId: string): boolean => {
    const story = getStoryById(storyId);
    return story ? story.likedBy.includes(userId) : false;
};

// Generar ID único para historias
const generateStoryId = (): string => {
    return 'story_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Actualizar likes del usuario en su perfil
const updateUserLikes = (authorId: string, likeDelta: number): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Obtener estadísticas de historias
export const getStoriesStats = () => {
    const stories = getAllStories();
    const totalStories = stories.length;
    const totalLikes = stories.reduce((sum, story) => sum + story.likes, 0);
    const mostLikedStory = stories.length > 0
        ? stories.reduce((max, story) => story.likes > max.likes ? story : max)
        : null;

    return {
        totalStories,
        totalLikes,
        mostLikedStory
    };
};