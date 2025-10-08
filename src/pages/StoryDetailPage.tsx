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

    // Función para procesar contenido con formato y imágenes
    const processContent = (content: string) => {
        // Procesar markdown básico
        let processedContent = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **negrita**
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // *cursiva*
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-md my-4" />'); // ![alt](src)

        return processedContent;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header con navegación */}
            <div className="mb-6">
                <button
                    onClick={handleBackToStories}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
                >
                    ← Volver a Historias
                </button>
            </div>
            {/* Contenido de la historia */}
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Encabezado de la historia */}
                <header className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 border-b">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{story.title}</h1>
                    {/* Badges de tipo y tema */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${story.type === 'Real'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                            }`}>
                            {story.type === 'Real' ? '✨' : '📚'} {story.type}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${story.theme === 'Aventura' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                            story.theme === 'Fantasía' ? 'bg-violet-100 text-violet-800 border border-violet-200' :
                                story.theme === 'Corazón' ? 'bg-pink-100 text-pink-800 border border-pink-200' :
                                    story.theme === 'Terror' ? 'bg-gray-100 text-gray-800 border border-gray-200' :
                                        story.theme === 'Educativa' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                            'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}>
                            {story.theme === 'Aventura' ? '🗺️' :
                                story.theme === 'Fantasía' ? '🧙‍♂️' :
                                    story.theme === 'Corazón' ? '💖' :
                                        story.theme === 'Terror' ? '👻' :
                                            story.theme === 'Educativa' ? '📖' :
                                                '🏆'} {story.theme}
                        </span>
                    </div>
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
                        {story.content.split('\n').map((paragraph, index) => {
                            const processedParagraph = processContent(paragraph);
                            return (
                                <div
                                    key={index}
                                    className="mb-4 text-gray-800 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: processedParagraph }}
                                />
                            );
                        })}
                    </div>
                </div>
                {/* Footer con acciones */}
                <footer className="bg-gray-50 p-6 border-t">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(`/stories/${story.id}/comments`)}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 transition-colors"
                            >
                                <span className="text-xl">💬</span>
                                <span>Comentar</span>
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
}

export default StoryDetailPage;