import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useLanguage } from '../lib/LanguageContext';
import { getNewsPreview, getNewsStats, clearTestNewsData, migrateNewsWithNewFields } from '../lib/newsManager';
import type { NewsPreview } from '../lib/newsManager';

const NewsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();

    const [news, setNews] = useState<NewsPreview[]>([]);
    const [stats, setStats] = useState({ totalNews: 0, totalLikes: 0, totalViews: 0, featuredNews: null, mostViewedNews: null });
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
    const [filteredNews, setFilteredNews] = useState<NewsPreview[]>([]);

    const categories = ['Todas', 'StoryUp', 'Educación', 'Tecnología', 'Cultura', 'Deportes', 'Salud', 'Comunidad'];

    useEffect(() => {
        // Primero migrar noticias existentes con los nuevos campos
        migrateNewsWithNewFields();
        // Luego limpiar solo datos inválidos
        clearTestNewsData();
        // Finalmente cargar noticias y estadísticas reales
        loadNews();
    }, []);

    useEffect(() => {
        // Filtrar noticias por categoría
        if (selectedCategory === 'Todas') {
            setFilteredNews(news);
        } else {
            setFilteredNews(news.filter(item => item.category === selectedCategory));
        }
    }, [news, selectedCategory]);

    // Recargar datos when the component becomes visible again
    useEffect(() => {
        const handleFocus = () => {
            loadNews();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const loadNews = () => {
        const newsData = getNewsPreview();
        const statsData = getNewsStats();
        setNews(newsData);
        setStats(statsData);
    };

    const handleNewsClick = (newsId: string) => {
        navigate(`/news/${newsId}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
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

    const renderEmptySlots = () => {
        const emptySlots = [];
        const startFrom = filteredNews.length + 1;
        const maxSlots = Math.max(10, filteredNews.length + 5);

        for (let i = startFrom; i <= maxSlots; i++) {
            emptySlots.push(
                <div key={`empty-${i}`} className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <span className="text-2xl font-bold text-gray-300 mr-4 w-8">{i}</span>
                    <div className="flex-1">
                        <p className="text-gray-400 font-medium">Sin noticia creada</p>
                        <p className="text-sm text-gray-300">Esperando nueva noticia...</p>
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
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">📰 Noticias</h1>
                            <p className="text-gray-600">
                                Últimas noticias de actualidad creadas por nuestros docentes y administradores
                            </p>
                        </div>
                        {/* Botón para crear noticias - solo para admin y teacher */}
                        {(user.role === 'admin' || user.role === 'teacher') && (
                            <button
                                onClick={() => navigate('/create-news')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl"
                            >
                                <span className="text-lg">✍️</span>
                                <span>Crear Noticia</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">📰</span>
                            <div>
                                <p className="text-sm text-blue-600 font-medium">Total Noticias</p>
                                <p className="text-2xl font-bold text-blue-800">{stats.totalNews}</p>
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
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">👀</span>
                            <div>
                                <p className="text-sm text-green-600 font-medium">Total Vistas</p>
                                <p className="text-2xl font-bold text-green-800">{stats.totalViews}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">⭐</span>
                            <div>
                                <p className="text-sm text-yellow-600 font-medium">Destacada</p>
                                <p className="text-sm font-bold text-yellow-800 truncate">
                                    {stats.featuredNews?.title || 'Ninguna aún'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros por categoría */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {category === 'Todas' ? '🔍' : getCategoryIcon(category)} {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista de noticias */}
            <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        📋 Lista de Noticias {selectedCategory !== 'Todas' && `- ${selectedCategory}`}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Las noticias más recientes aparecen primero
                    </p>
                </div>

                <div className="p-6">
                    {filteredNews.length === 0 && news.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <div className="text-6xl mb-4">📰</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">¡Aún no hay noticias!</h3>
                            <p className="text-gray-500 mb-4">Sé el primero en compartir una noticia importante con la comunidad.</p>
                            <p className="text-sm text-blue-600">💡 Los usuarios con rol Padre/Docente o Admin pueden crear noticias</p>
                        </div>
                    )}

                    {filteredNews.length === 0 && news.length > 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <div className="text-6xl mb-4">{getCategoryIcon(selectedCategory)}</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay noticias en "{selectedCategory}"</h3>
                            <p className="text-gray-500 mb-4">No se encontraron noticias en esta categoría.</p>
                            <button
                                onClick={() => setSelectedCategory('Todas')}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Ver todas las noticias
                            </button>
                        </div>
                    )}

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {filteredNews.map((item, index) => (
                            <div key={item.id} className="border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {item.featured && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                        ⭐ Destacada
                                                    </span>
                                                )}
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                                                    {getCategoryIcon(item.category)} {item.category}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleNewsClick(item.id)}
                                                className="text-left w-full"
                                            >
                                                <h3 className="font-bold text-lg text-gray-900 hover:text-blue-700 transition-colors mb-2">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                                    {item.summary}
                                                </p>
                                            </button>
                                        </div>
                                        <span className="text-2xl font-bold text-blue-600 ml-4 w-8">{index + 1}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <div className="flex items-center space-x-4">
                                            <span className="flex items-center">
                                                <span className="mr-1">{getRoleIcon(item.author.role)}</span>
                                                <span className="font-medium">
                                                    {item.author.name || item.author.username}
                                                </span>
                                            </span>
                                            <span className="flex items-center">
                                                <span className="mr-1">❤️</span>
                                                <span className="font-medium">{item.likes}</span>
                                            </span>
                                            <span className="flex items-center">
                                                <span className="mr-1">👀</span>
                                                <span className="font-medium">{item.views}</span>
                                            </span>
                                        </div>
                                        <span className="text-gray-500">
                                            {formatDate(item.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Slots vacíos - solo mostrar si hay noticias reales */}
                        {filteredNews.length > 0 && renderEmptySlots()}
                    </div>
                </div>
            </div>

            {/* Footer informativo */}
            <div className="mt-8 text-center text-gray-500">
                <p className="text-sm">
                    💡 Haz clic en el título de cualquier noticia para leerla completa y dar like
                </p>
                {user && (user.role === 'admin' || user.role === 'teacher') && (
                    <p className="text-sm mt-2 text-blue-600">
                        ✍️ Como {user.role === 'admin' ? 'Administrador' : 'Padre/Docente'}, puedes crear noticias desde tu perfil
                    </p>
                )}
            </div>
        </div>
    );
};

export default NewsPage;

