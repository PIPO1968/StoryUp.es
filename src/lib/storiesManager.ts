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
    try {
        const stories = localStorage.getItem('storyup_stories');
        if (stories) {
            const parsedStories = JSON.parse(stories);
            let hasChanges = false;

            const migratedStories = parsedStories.map((story: any) => {
                // Si la historia no tiene los campos nuevos, añadirlos
                if (!story.type || !story.theme) {
                    hasChanges = true;
                    return {
                        ...story,
                        type: story.type || 'Ficticia',
                        theme: story.theme || 'Aventura'
                    };
                }
                return story;
            });

            if (hasChanges) {
                localStorage.setItem('storyup_stories', JSON.stringify(migratedStories));
                console.log('✅ Historias migradas con nuevos campos (type y theme)');
            }
        }
    } catch (error) {
        console.error('Error migrando historias:', error);
    }
};

// Limpiar datos de prueba/ficticios (solo datos inválidos, no todas las historias)
export const clearTestData = (): void => {
    try {
        const stories = localStorage.getItem('storyup_stories');
        if (stories) {
            const parsedStories = JSON.parse(stories);
            // Solo mantener historias válidas (no eliminar todas)
            const validStories = parsedStories.filter((story: any) =>
                story &&
                story.id &&
                story.title &&
                story.content &&
                story.author &&
                story.author.id &&
                story.author.username &&
                typeof story.likes === 'number' &&
                Array.isArray(story.likedBy) &&
                story.createdAt
            ).map((story: any) => ({
                ...story,
                // Asignar valores por defecto para campos nuevos si no existen
                type: story.type || 'Ficticia',
                theme: story.theme || 'Aventura'
            }));

            if (validStories.length !== parsedStories.length) {
                localStorage.setItem('storyup_stories', JSON.stringify(validStories));
                console.log('Historias inválidas eliminadas, historias válidas preservadas');
            }
        }
    } catch (error) {
        console.error('Error limpiando datos de prueba:', error);
    }
};

// Obtener todas las historias ordenadas por fecha (más recientes primero)
export const getAllStories = (): Story[] => {
    try {
        const stories = localStorage.getItem('storyup_stories');
        if (stories) {
            const parsedStories: Story[] = JSON.parse(stories);
            // Verificar que las historias tengan la estructura correcta
            const validStories = parsedStories.filter(story =>
                story &&
                story.id &&
                story.title &&
                story.content &&
                story.author &&
                story.author.id &&
                story.author.username &&
                typeof story.likes === 'number' &&
                Array.isArray(story.likedBy) &&
                story.createdAt
            );

            // Ordenar por fecha de creación (más recientes primero)
            return validStories.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
        return [];
    } catch (error) {
        console.error('Error obteniendo historias:', error);
        return [];
    }
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
    const stories = getAllStories();

    const newStory: Story = {
        ...story,
        id: generateStoryId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    stories.unshift(newStory); // Agregar al inicio para que aparezca primera

    try {
        localStorage.setItem('storyup_stories', JSON.stringify(stories));
        return newStory;
    } catch (error) {
        console.error('Error guardando historia:', error);
        throw error;
    }
};

// Dar/quitar like a una historia
export const toggleStoryLike = (storyId: string, userId: string): Story | null => {
    const stories = getAllStories();
    const storyIndex = stories.findIndex(story => story.id === storyId);

    if (storyIndex === -1) return null;

    const story = stories[storyIndex];
    const hasLiked = story.likedBy.includes(userId);

    if (hasLiked) {
        // Quitar like
        story.likedBy = story.likedBy.filter(id => id !== userId);
        story.likes = Math.max(0, story.likes - 1);
    } else {
        // Agregar like
        story.likedBy.push(userId);
        story.likes += 1;
    }

    story.updatedAt = new Date().toISOString();

    try {
        localStorage.setItem('storyup_stories', JSON.stringify(stories));

        // También actualizar los likes del usuario
        updateUserLikes(story.author.id, hasLiked ? -1 : 1);

        return story;
    } catch (error) {
        console.error('Error actualizando like:', error);
        return null;
    }
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
    try {
        const users = localStorage.getItem('storyup_users');
        if (users) {
            const parsedUsers = JSON.parse(users);
            const userIndex = parsedUsers.findIndex((user: any) => user.id === authorId);

            if (userIndex >= 0) {
                parsedUsers[userIndex].likes = Math.max(0, (parsedUsers[userIndex].likes || 0) + likeDelta);
                localStorage.setItem('storyup_users', JSON.stringify(parsedUsers));
            }
        }
    } catch (error) {
        console.error('Error actualizando likes del usuario:', error);
    }
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