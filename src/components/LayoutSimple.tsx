import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-blue-600">StoryUp.es</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Hola, {user?.name || user?.username}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex">
                    {/* Sidebar */}
                    <aside className="w-64 py-6 pr-8 hidden lg:block">
                        <nav className="space-y-2">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                            >
                                <span>🏠</span>
                                <span>Inicio</span>
                            </button>
                            <button
                                onClick={() => navigate('/stories')}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                            >
                                <span>📚</span>
                                <span>Historias</span>
                            </button>
                            <button
                                onClick={() => navigate('/create')}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                            >
                                <span>✍️</span>
                                <span>Crear Historia</span>
                            </button>
                            <button
                                onClick={() => navigate('/news')}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                            >
                                <span>📰</span>
                                <span>Noticias</span>
                            </button>
                            <button
                                onClick={() => navigate('/contests')}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                            >
                                <span>🏆</span>
                                <span>Concursos</span>
                            </button>
                            <button
                                onClick={() => navigate('/profile')}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                            >
                                <span>👤</span>
                                <span>Perfil</span>
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 py-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;