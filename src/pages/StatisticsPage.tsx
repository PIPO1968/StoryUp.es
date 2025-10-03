import React, { useState, useEffect } from 'react';
import { getAllStats } from '../lib/realStatsManager';
import type {
    UserStats,
    StoryStats,
    NewsStats,
    EngagementStats,
    EducationalCenterStats,
    PlatformStats
} from '../lib/realStatsManager';

const StatisticsPage: React.FC = () => {
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [storyStats, setStoryStats] = useState<StoryStats | null>(null);
    const [newsStats, setNewsStats] = useState<NewsStats | null>(null);
    const [engagementStats, setEngagementStats] = useState<EngagementStats | null>(null);
    const [centerStats, setCenterStats] = useState<EducationalCenterStats | null>(null);
    const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [healthStatus, setHealthStatus] = useState<'excellent' | 'good' | 'warning' | 'critical'>('excellent');

    const loadAllStats = async () => {
        try {
            setLoading(true);
            const stats = await getAllStats();

            setUserStats(stats.users);
            setStoryStats(stats.stories);
            setNewsStats(stats.news);
            setEngagementStats(stats.engagement);
            setCenterStats(stats.centers);
            setPlatformStats(stats.platform);

            // Calcular estado de salud basado en las métricas
            const totalUsers = stats.users.totalUsers;
            const totalStories = stats.stories.totalStories;
            const totalNews = stats.news.totalNews;

            if (totalUsers >= 100 && totalStories >= 50 && totalNews >= 20) {
                setHealthStatus('excellent');
            } else if (totalUsers >= 50 && totalStories >= 25 && totalNews >= 10) {
                setHealthStatus('good');
            } else if (totalUsers >= 10 && totalStories >= 5 && totalNews >= 2) {
                setHealthStatus('warning');
            } else {
                setHealthStatus('critical');
            }

            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error loading statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllStats();

        // Auto-refresh every 30 seconds
        const interval = setInterval(loadAllStats, 30000);

        return () => clearInterval(interval);
    }, []);

    const getHealthStatusColor = (status: string) => {
        switch (status) {
            case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
            case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getHealthStatusIcon = (status: string) => {
        switch (status) {
            case 'excellent': return '🟢';
            case 'good': return '🔵';
            case 'warning': return '🟡';
            case 'critical': return '🔴';
            default: return '⚪';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando estadísticas en tiempo real...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Panel de Estadísticas</h1>
                    <p className="text-gray-600 text-lg">Dashboard en tiempo real de StoryUp.es</p>
                    <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
                        <span>Última actualización: {lastUpdate.toLocaleTimeString()}</span>
                        <div className={`px-3 py-1 rounded-full border ${getHealthStatusColor(healthStatus)}`}>
                            {getHealthStatusIcon(healthStatus)} Estado: {healthStatus === 'excellent' ? 'Excelente' :
                                healthStatus === 'good' ? 'Bueno' :
                                    healthStatus === 'warning' ? 'Advertencia' : 'Crítico'}
                        </div>
                    </div>
                </div>

                {/* Resumen Principal */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                                <p className="text-3xl font-bold text-blue-600">{userStats?.totalUsers || 0}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <span className="text-2xl">👥</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Historias</p>
                                <p className="text-3xl font-bold text-green-600">{storyStats?.totalStories || 0}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <span className="text-2xl">📚</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Noticias</p>
                                <p className="text-3xl font-bold text-purple-600">{newsStats?.totalNews || 0}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <span className="text-2xl">📰</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                                <p className="text-3xl font-bold text-red-600">{storyStats?.totalLikes || 0}</p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-full">
                                <span className="text-2xl">❤️</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estadísticas de Usuarios */}
                {userStats && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <span className="mr-3">👥</span>
                            Estadísticas de Usuarios
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Métricas Generales */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Métricas Generales</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium">👥 Total de Usuarios</span>
                                        <span className="font-bold text-lg text-blue-600">{userStats.totalUsers}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-sm font-medium">🟢 Usuarios Activos</span>
                                        <span className="font-bold text-lg text-green-600">{userStats.activeUsers}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                        <span className="text-sm font-medium">🆕 Nuevos este Mes</span>
                                        <span className="font-bold text-lg text-purple-600">{userStats.newUsersThisMonth}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Distribución por Roles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Distribución por Roles</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                                            <span className="text-sm">👨‍🏫 Padre/Docente (incluye Admin)</span>
                                            <span className="font-bold text-blue-700">{userStats.usersByRole.teacher}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                                            <span className="text-sm">👤 Usuarios</span>
                                            <span className="font-bold text-green-700">{userStats.usersByRole.user}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Contribuyentes */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Top Contribuyentes</h4>
                                    {userStats.topContributors.length > 0 ? (
                                        <div className="space-y-2">
                                            {userStats.topContributors.slice(0, 5).map((contributor, index) => (
                                                <div key={contributor.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium">#{index + 1}</span>
                                                        <span className="text-sm">{contributor.username}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        <span>{contributor.contributions} contribuciones</span>
                                                        <span className="ml-2">❤️ {contributor.likes}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No hay contribuyentes aún</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Estadísticas de Historias */}
                {storyStats && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <span className="mr-3">📚</span>
                            Estadísticas de Historias
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Métricas Generales */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Métricas Generales</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium">📚 Total de Historias</span>
                                        <span className="font-bold text-lg text-blue-600">{storyStats.totalStories}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                        <span className="text-sm font-medium">❤️ Total de Likes</span>
                                        <span className="font-bold text-lg text-red-600">{storyStats.totalLikes}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                        <span className="text-sm font-medium">⭐ Promedio de Likes</span>
                                        <span className="font-bold text-lg text-yellow-600">{storyStats.averageLikes}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Por Tipo */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Por Tipo</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                                        <span className="text-sm">🌟 Reales</span>
                                        <span className="font-bold text-green-700">{storyStats.storiesByType.Real}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                                        <span className="text-sm">🎭 Ficticias</span>
                                        <span className="font-bold text-purple-700">{storyStats.storiesByType.Ficticia}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Por Tema */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Por Tema</h4>
                                <div className="space-y-2">
                                    {Object.entries(storyStats.storiesByTheme).map(([theme, count]) => (
                                        <div key={theme} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                                            <span className="text-sm">{theme}</span>
                                            <span className="font-bold text-blue-700">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Historia Más Popular */}
                        {storyStats.mostPopularStory && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                    <span className="mr-2">🏆</span>
                                    Historia Más Popular
                                </h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">{storyStats.mostPopularStory.title}</p>
                                        <p className="text-sm text-gray-600">por {storyStats.mostPopularStory.author}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-orange-600">{storyStats.mostPopularStory.likes} ❤️</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Estadísticas de Noticias */}
                {newsStats && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <span className="mr-3">📰</span>
                            Estadísticas de Noticias
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Métricas Generales */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Métricas Generales</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium">📰 Total Artículos</span>
                                        <span className="font-bold text-lg text-blue-600">{newsStats.totalNews}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-sm font-medium">👁️ Total Visualizaciones</span>
                                        <span className="font-bold text-lg text-green-600">{newsStats.totalViews}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                        <span className="text-sm font-medium">⭐ Promedio Visualizaciones</span>
                                        <span className="font-bold text-lg text-purple-600">{newsStats.averageEngagement}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Artículo Más Popular */}
                            {newsStats.mostViewedNews && (
                                <div className="col-span-2">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                        <span className="mr-2">🏆</span>
                                        Artículo Más Popular
                                    </h4>
                                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 mb-1">{newsStats.mostViewedNews.title}</p>
                                                <p className="text-sm text-gray-600">Categoría: {newsStats.mostViewedNews.category}</p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="text-2xl font-bold text-blue-600">{newsStats.mostViewedNews.views}</p>
                                                <p className="text-sm text-gray-600">visualizaciones</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Estadísticas de Engagement */}
                {engagementStats && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <span className="mr-3">💫</span>
                            Engagement y Actividad
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Actividad Diaria */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Diaria</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-sm font-medium">📅 Hoy</span>
                                        <span className="font-bold text-lg text-green-600">{engagementStats.dailyActivity.today}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="text-sm font-medium">📆 Ayer</span>
                                        <span className="font-bold text-lg text-blue-600">{engagementStats.dailyActivity.yesterday}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                        <span className="text-sm font-medium">📊 Esta Semana</span>
                                        <span className="font-bold text-lg text-purple-600">{engagementStats.dailyActivity.thisWeek}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Usuarios Más Activos */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Usuarios Más Activos</h3>
                                {engagementStats.mostActiveUsers.length > 0 ? (
                                    <div className="space-y-2">
                                        {engagementStats.mostActiveUsers.slice(0, 5).map((user, index) => (
                                            <div key={user.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium">#{index + 1}</span>
                                                    <span className="text-sm">{user.username}</span>
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    <span>❤️ {user.totalLikes}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">No hay datos de actividad aún</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Estadísticas de Centros Educativos */}
                {centerStats && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <span className="mr-3">🏫</span>
                            Centros Educativos
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Información sobre usuarios por rol */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Usuarios por Rol Educativo</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="text-sm font-medium">👨‍🏫 Padres/Docentes</span>
                                        <span className="font-bold text-lg text-blue-600">{centerStats.teacherCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-sm font-medium">👤 Usuarios</span>
                                        <span className="font-bold text-lg text-green-600">{centerStats.studentCount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Estado de funcionalidad */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Sistema de Centros</h3>
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm text-yellow-800 mb-2">
                                        <span className="font-medium">🚧 Funcionalidad en Desarrollo</span>
                                    </p>
                                    <p className="text-xs text-yellow-700">
                                        El sistema de gestión de centros educativos está planificado para futuras versiones.
                                        Actualmente se muestran solo las estadísticas de usuarios por rol educativo.
                                    </p>
                                </div>

                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Próximas Funcionalidades:</h4>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>• Registro de centros educativos</li>
                                        <li>• Asociación de usuarios a centros</li>
                                        <li>• Estadísticas por centro</li>
                                        <li>• Rankings de actividad</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Estadísticas de Plataforma */}
                {platformStats && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <span className="mr-3">⚙️</span>
                            Estado de la Plataforma
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Métricas de Rendimiento */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Rendimiento</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-sm font-medium">📊 Engagement Rate</span>
                                        <span className="font-bold text-lg text-green-600">{platformStats.engagementRate.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="text-sm font-medium">� Crecimiento Mensual</span>
                                        <span className="font-bold text-lg text-blue-600">{platformStats.monthlyGrowth}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Estado del Sistema */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado del Sistema</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-sm font-medium">🗄️ Base de Datos</span>
                                        <span className="font-bold text-lg text-green-600">✅ OK</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-sm font-medium">🔐 Autenticación</span>
                                        <span className="font-bold text-lg text-green-600">✅ OK</span>
                                    </div>
                                </div>
                            </div>

                            {/* Estadísticas de Almacenamiento */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Almacenamiento</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium">💾 Datos Usuarios</span>
                                        <span className="font-bold text-lg text-gray-600">{userStats?.totalUsers || 0} registros</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium">📁 Datos Contenido</span>
                                        <span className="font-bold text-lg text-gray-600">{platformStats.totalContent} elementos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Botón de Actualización Manual */}
                <div className="text-center">
                    <button
                        onClick={loadAllStats}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                        {loading ? '🔄 Actualizando...' : '🔄 Actualizar Estadísticas'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;