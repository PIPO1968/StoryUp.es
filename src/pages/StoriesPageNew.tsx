import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useLanguage } from '../lib/LanguageContext';
import { getStoriesPreview, getStoriesStats, clearTestData, migrateStoriesWithNewFields } from '../lib/storiesManager';
import type { StoryPreview } from '../lib/storiesManager';

const StoriesPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();

    const [stories, setStories] = useState<StoryPreview[]>([]);
    const [stats, setStats] = useState({ totalStories: 0, totalLikes: 0, mostLikedStory: null });

    useEffect(() => {
        // Primero migrar historias existentes con los nuevos campos
        migrateStoriesWithNewFields();
        // Luego limpiar solo datos inválidos
        clearTestData();
        // Finalmente cargar historias y estadísticas reales
        loadStories();
    }, []);

    // Recargar datos when the component becomes visible again
    useEffect(() => {
        const handleFocus = () => {
            loadStories();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const loadStories = () => {
        const storiesData = getStoriesPreview();
        const statsData = getStoriesStats();
        setStories(storiesData);
        setStats(statsData);
    };



    const handleStoryClick = (storyId: string) => {
        navigate(`/story/${storyId}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const renderEmptySlots = () => {
        const emptySlots = [];
        const startFrom = stories.length + 1;
        const maxSlots = Math.max(25, stories.length + 15);

        for (let i = startFrom; i <= maxSlots; i++) {
            emptySlots.push(
                <div key={`empty-${i}`} className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <span className="text-2xl font-bold text-gray-300 mr-4 w-8">{i}</span>
                    <div className="flex-1">
                        <p className="text-gray-400 font-medium">Sin historia creada</p>
                        <p className="text-sm text-gray-300">Esperando nueva historia...</p>
                    </div>
                </div>
            );
        }
        return emptySlots;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Header con estadísticas */}
            <div className="mb-8">
                <div className="mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 Historias</h1>
                        <p className="text-gray-600">
                            Descubre las historias más increíbles creadas por nuestra comunidad
                        </p>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">📖</span>
                            <div>
                                <p className="text-sm text-blue-600 font-medium">Total Historias</p>
                                <p className="text-2xl font-bold text-blue-800">{stats.totalStories}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">❤️</span>
                            <div>
                                <p className="text-sm text-red-600 font-medium">Total Likes</p>
                                <p className="text-2xl font-bold text-red-800">{stats.totalLikes}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">⭐</span>
                            <div>
                                <p className="text-sm text-yellow-600 font-medium">Más Popular</p>
                                <p className="text-sm font-bold text-yellow-800 truncate">
                                    {stats.mostLikedStory?.title || 'Ninguna aún'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de historias */}
            <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">📋 Lista de Historias</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Las historias más recientes aparecen primero
                    </p>
                </div>

                <div className="p-6">
                    {stories.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">¡Aún no hay historias!</h3>
                            <p className="text-gray-500 mb-4">Sé el primero en compartir una historia increíble con la comunidad.</p>
                            <p className="text-sm text-blue-600">💡 Usa "✍️ Crear Historia" en el menú lateral para comenzar</p>
                        </div>
                    )}

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {stories.map((story, index) => (
                            <div key={story.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group">
                                <span className="text-2xl font-bold text-blue-600 mr-4 w-8">{index + 1}</span>
                                <div className="flex-1">
                                    <button
                                        onClick={() => handleStoryClick(story.id)}
                                        className="text-left w-full"
                                    >
                                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                                            {story.title}
                                        </h3>
                                        {/* Badges de tipo y tema */}
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${story.type === 'Real'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {story.type === 'Real' ? '✨' : '📚'} {story.type}
                                            </span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${story.theme === 'Aventura' ? 'bg-orange-100 text-orange-800' :
                                                story.theme === 'Fantasía' ? 'bg-violet-100 text-violet-800' :
                                                    story.theme === 'Corazón' ? 'bg-pink-100 text-pink-800' :
                                                        story.theme === 'Terror' ? 'bg-gray-100 text-gray-800' :
                                                            story.theme === 'Educativa' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {story.theme === 'Aventura' ? '🗺️' :
                                                    story.theme === 'Fantasía' ? '🧙‍♂️' :
                                                        story.theme === 'Corazón' ? '💖' :
                                                            story.theme === 'Terror' ? '👻' :
                                                                story.theme === 'Educativa' ? '📖' :
                                                                    '🏆'} {story.theme}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <div className="flex items-center space-x-4">
                                                <span className="flex items-center">
                                                    <span className="mr-1">👤</span>
                                                    <span className="font-medium">
                                                        {story.author.name || story.author.username}
                                                    </span>
                                                </span>
                                                <span className="flex items-center">
                                                    <span className="mr-1">❤️</span>
                                                    <span className="font-medium">{story.likes}</span>
                                                </span>
                                            </div>
                                            <span className="text-gray-500">
                                                {formatDate(story.createdAt)}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Slots vacíos - solo mostrar si hay historias reales */}
                        {stories.length > 0 && renderEmptySlots()}
                    </div>
                </div>
            </div>

            {/* Footer informativo */}
            <div className="mt-8 text-center text-gray-500">
                <p className="text-sm">
                    💡 Haz clic en el título de cualquier historia para leerla completa y dar like
                </p>
            </div>
        </div>
    );
};

export default StoriesPage;