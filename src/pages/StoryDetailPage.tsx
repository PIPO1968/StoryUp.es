import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useLanguage } from '../lib/LanguageContext';
import { getStoryById, toggleStoryLike, hasUserLikedStory } from '../lib/storiesManager';
import type { Story } from '../lib/storiesManager';

const StoryDetailPage: React.FC = () => {
    const { storyId } = useParams<{ storyId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();

    const [story, setStory] = useState<Story | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (storyId) {
            const foundStory = getStoryById(storyId);
            setStory(foundStory);

            if (foundStory && user) {
                setIsLiked(hasUserLikedStory(storyId, user.id || user.username));
            }
        }
        setLoading(false);
    }, [storyId, user]);

    const handleLike = () => {
        if (!story || !user) return;

        const updatedStory = toggleStoryLike(story.id, user.id || user.username);
        if (updatedStory) {
            setStory(updatedStory);
            setIsLiked(!isLiked);
        }
    };

    const handleBackToStories = () => {
        navigate('/stories');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando historia...</p>
                </div>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-2xl font-bold text-red-800 mb-4">Historia no encontrada</h2>
                    <p className="text-red-600 mb-6">La historia que buscas no existe o ha sido eliminada.</p>
                    <button
                        onClick={handleBackToStories}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        ← Volver a Historias
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header con navegación */}
            <div className="mb-6">
                <button
                    onClick={handleBackToStories}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
                >
                    <span className="mr-2">←</span>
                    Volver a Historias
                </button>
            </div>

            {/* Contenido de la historia */}
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Encabezado de la historia */}
                <header className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 border-b">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{story.title}</h1>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        {story.author.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {story.author.name || story.author.username}
                                    </p>
                                    <p className="text-sm text-gray-600">@{story.author.username}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                <p>Creada: {formatDate(story.createdAt)}</p>
                                {story.updatedAt !== story.createdAt && (
                                    <p>Actualizada: {formatDate(story.updatedAt)}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Cuerpo de la historia */}
                <div className="p-8">
                    <div className="prose prose-lg max-w-none">
                        {story.content.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Footer con acciones */}
                <footer className="bg-gray-50 p-6 border-t">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isLiked
                                        ? 'bg-red-100 text-red-700 border border-red-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                    }`}
                            >
                                <span className={`text-xl ${isLiked ? '❤️' : '🤍'}`}>
                                    {isLiked ? '❤️' : '🤍'}
                                </span>
                                <span className="font-semibold">{story.likes}</span>
                                <span>{isLiked ? 'Te gusta' : 'Me gusta'}</span>
                            </button>
                        </div>

                        <div className="text-sm text-gray-500">
                            Historia #{story.id.split('_')[1]}
                        </div>
                    </div>
                </footer>
            </article>
        </div>
    );
};

export default StoryDetailPage;