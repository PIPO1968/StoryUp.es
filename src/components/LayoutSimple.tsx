import React, { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { getUserStats, markUserAsOnline, cleanupInactiveUsers } from '../lib/userStats';
import { useLanguage } from '../lib/LanguageContext';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const { language, t, setLanguage, formatDate } = useLanguage();

    // Estados para el reloj y contadores reales
    const [currentTime, setCurrentTime] = useState(new Date());
    const [totalUsers, setTotalUsers] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState(0);

    // Manejador del cambio de idioma
    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
    };

    // Efecto para cargar datos iniciales y actualizar el reloj
    useEffect(() => {
        // Cargar estadísticas reales iniciales
        const stats = getUserStats();
        setTotalUsers(stats.totalUsers);
        setOnlineUsers(stats.onlineUsers);

        // Marcar usuario actual como online
        if (user) {
            markUserAsOnline(user.id || user.username, user.username);
        }

        // Timer para actualizar el reloj cada segundo
        const clockTimer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(clockTimer);
    }, []);

    // Efecto para actualizar contadores de usuarios reales cada 30 segundos
    useEffect(() => {
        const userTimer = setInterval(() => {
            // Limpiar usuarios inactivos y obtener estadísticas actuales
            cleanupInactiveUsers();
            const stats = getUserStats();

            setTotalUsers(stats.totalUsers);
            setOnlineUsers(stats.onlineUsers);

            // Mantener usuario actual como activo
            if (user) {
                markUserAsOnline(user.id || user.username, user.username);
            }
        }, 30000);

        return () => clearInterval(userTimer);
    }, [user]);

    // Efecto para marcar usuario como online cuando cambia
    useEffect(() => {
        if (user) {
            markUserAsOnline(user.id || user.username, user.username);
            // Actualizar contador inmediatamente
            const stats = getUserStats();
            setOnlineUsers(stats.onlineUsers);
        }
    }, [user]);

    const handleLogout = () => {

        setUser(null);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header fijo arriba */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo a la izquierda */}
                        <div className="flex items-center space-x-3">
                            <img src="/assets/favicon.ico.png" alt="StoryUp Logo" className="w-10 h-10 rounded-lg" />
                            <h1 className="text-2xl font-bold text-blue-600">StoryUp.es</h1>
                        </div>

                        {/* Centro - Información de usuarios y fecha */}
                        <div className="flex items-center space-x-6">
                            <div className="text-sm text-gray-600 flex items-center">
                                <span className="font-medium">👥 {t.users}: </span>
                                <span className="text-blue-600 font-semibold ml-1">{totalUsers.toLocaleString()}</span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                <span className="font-medium">{t.online}: </span>
                                <span className="text-green-600 font-semibold ml-1">{onlineUsers}</span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center">
                                <span className="mr-2">🗓️</span>
                                <span>
                                    {formatDate(currentTime)}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center">
                                <span className="mr-2">🕒</span>
                                <span className="font-mono font-semibold text-blue-600">
                                    {currentTime.toLocaleTimeString(language === 'zh' ? 'zh-CN' : language === 'en' ? 'en-US' : language === 'de' ? 'de-DE' : language === 'fr' ? 'fr-FR' : 'es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Derecha - Selector de idioma y cerrar sesión */}
                        <div className="flex items-center space-x-4">
                            {/* Selector de idioma */}
                            <div className="relative">
                                <select
                                    value={language}
                                    onChange={handleLanguageChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2 pr-8 appearance-none cursor-pointer hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="es">🇪🇸 Español</option>
                                    <option value="en">🇬🇧 English</option>
                                    <option value="fr">🇫🇷 Français</option>
                                    <option value="de">🇩🇪 Deutsch</option>
                                    <option value="zh">🇨🇳 中文</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                            >
                                {t.logout}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Layout principal con sidebar y contenido */}
            <div className="flex w-full">
                {/* Sidebar fijo a la izquierda */}
                <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-16 z-40">
                    <nav className="p-4 space-y-2">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                        >
                            <span>🏠</span>
                            <span>{t.dashboard}</span>
                        </button>
                        <button
                            onClick={() => navigate('/stories')}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                        >
                            <span>📚</span>
                            <span>{t.stories}</span>
                        </button>
                        <button
                            onClick={() => navigate('/create')}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                        >
                            <span>✍️</span>
                            <span>{t.createStory}</span>
                        </button>
                        <button
                            onClick={() => navigate('/news')}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                        >
                            <span>📰</span>
                            <span>{t.newsNav}</span>
                        </button>
                        <button
                            onClick={() => navigate('/statistics')}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                        >
                            <span>📊</span>
                            <span>{t.statisticsNav}</span>
                        </button>
                        <button
                            onClick={() => navigate('/contests')}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                        >
                            <span>🏆</span>
                            <span>{t.contests}</span>
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                        >
                            <span>👤</span>
                            <span>{t.profile}</span>
                        </button>
                    </nav>
                </aside>

                {/* Contenido principal con margen para el sidebar */}
                <main className="flex-1 ml-64 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;