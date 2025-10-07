import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useLanguage } from '../lib/LanguageContext';
import { getNewsById, toggleNewsLike } from '../lib/newsManager';
import type { News } from '../lib/newsManager';

const NewsDetailPage: React.FC = () => {
    const { newsId } = useParams<{ newsId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();

    const [news, setNews] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (newsId) {
            loadNews(newsId);
        }
    }, [newsId]);

    const loadNews = async (id: string) => {
        setLoading(true);
        try {
            const newsData = getNewsById(id);
            if (newsData) {
                setNews(newsData);
                // Verificar si el usuario actual ya dio like
                if (user) {
                    setIsLiked(newsData.likedBy.includes(user.id || user.username));
                }
            }
        } catch (error) {
            console.error('Error cargando noticia:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!news || !user) return;

        try {
            const result = toggleNewsLike(news.id, user.id || user.username);
            setIsLiked(result.liked);
            setNews(prev => prev ? { ...prev, likes: result.newLikeCount } : null);
        } catch (error) {
            console.error('Error al dar like:', error);
            alert('Error al procesar el like. Inténtalo de nuevo.');
        }
    };

    const handleBackToNews = () => {
        navigate('/news');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando noticia...</p>
                </div>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-2xl font-bold text-red-800 mb-4">Noticia no encontrada</h2>
                    <p className="text-red-600 mb-6">La noticia que buscas no existe o ha sido eliminada.</p>
                    <button
                        onClick={handleBackToNews}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        ← Volver a Noticias
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

    const getCategoryColor = (category: string) => {
        const colors = {
            'StoryUp': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'Educación': 'bg-blue-100 text-blue-800 border-blue-200',
            'Tecnología': 'bg-purple-100 text-purple-800 border-purple-200',
            'Cultura': 'bg-pink-100 text-pink-800 border-pink-200',
            'Deportes': 'bg-green-100 text-green-800 border-green-200',
            'Salud': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Comunidad': 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getCategoryIcon = (category: string) => {
        const icons = {
            'StoryUp': '🚀',
            'Educación': '📚',
            'Tecnología': '💻',
            'Cultura': '🎭',
            'Deportes': '⚽',
            'Salud': '🏥',
            'Comunidad': '👥'
        };
        return icons[category as keyof typeof icons] || '📰';
    };

    const getRoleIcon = (role: string) => {
        const icons = {
            'admin': '👑',
            'teacher': '👨‍🏫'
        };
        return icons[role as keyof typeof icons] || '👤';
    };

    // Función para procesar contenido con formato y imágenes (igual que en historias)
    const processContent = (content: string) => {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **negrita**
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // *cursiva*
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-md my-4" />'); // ![alt](src)
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header con navegación */}
            <div className="mb-6">
                <button
                    onClick={handleBackToNews}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
                >
                    <span className="mr-2">←</span>
                    Volver a Noticias
                </button>
            </div>

            {/* Contenido de la noticia */}
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Encabezado de la noticia */}
                <header className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 border-b">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{news.title}</h1>

                    {/* Badges de categoría y destacada */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {news.featured && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                ⭐ Noticia Destacada
                            </span>
                        )}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(news.category)}`}>
                            {getCategoryIcon(news.category)} {news.category}
                        </span>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        {news.author.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 flex items-center">
                                        {getRoleIcon(news.author.role)} {news.author.name || news.author.username}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        @{news.author.username} • {news.author.role === 'admin' ? 'Administrador' : 'Padre/Docente'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="text-sm text-gray-600 text-center">
                                <p className="font-semibold">👀 {news.views}</p>
                                <p>Vistas</p>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>Publicada: {formatDate(news.createdAt)}</p>
                                {news.updatedAt !== news.createdAt && (
                                    <p>Actualizada: {formatDate(news.updatedAt)}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Cuerpo de la noticia */}
                <div className="p-8">
                    <div className="prose prose-lg max-w-none">
                        {news.content.split('\n').map((paragraph, index) => {
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
                                onClick={handleLike}
                                disabled={!user}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isLiked
                                    ? 'bg-red-100 text-red-700 border border-red-200'
                                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                    } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className={`text-xl ${isLiked ? '❤️' : '🤍'}`}>
                                    {isLiked ? '❤️' : '🤍'}
                                </span>
                                <span className="font-semibold">{news.likes}</span>
                                <span>{isLiked ? 'Te gusta' : 'Me gusta'}</span>
                            </button>

                            {!user && (
                                <p className="text-sm text-gray-500">
                                    Inicia sesión para dar like y comentar
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(`/news/${news.id}/comments`)}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                <span>�</span>
                                <span>Comentar</span>
                            </button>
                        </div>
                    </div>
                </footer>
            </article>

            {/* Información adicional */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Información</h3>
                <p className="text-sm text-blue-700">
                    Esta noticia fue creada por un miembro de nuestra comunidad educativa.
                    Si encuentras contenido inapropiado, por favor contacta con los administradores.
                </p>
            </div>
        </div>
    );
};

export default NewsDetailPage;