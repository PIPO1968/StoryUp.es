import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from '@/components/ui/button';
import { getTotalUsers, getOnlineUsers } from '../lib/auth';
import {
    Home,
    MessageCircle,
    Plus,
    User,
    LogOut,
    BookOpen,
    BarChart3,
    Trophy,
    Newspaper,
    Award
} from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
        navigate('/');
    };

    const sidebarItems = [
        { icon: Home, label: 'Inicio', path: '/feed' },
        { icon: BookOpen, label: 'Historias', path: '/stories' },
        { icon: Plus, label: 'Crea tu Historia', path: '/create' },
        { icon: BarChart3, label: 'Estadísticas', path: '/statistics' },
        { icon: Newspaper, label: 'Noticias', path: '/news' },
        { icon: Trophy, label: 'Concursos', path: '/contests' },
        { icon: User, label: 'Perfil', path: '/profile' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <img src="/favicon.ico" alt="StoryUp" className="h-8 w-8 mr-3" />
                            <h1 className="text-2xl font-bold text-blue-600">StoryUp</h1>
                        </div>

                        {/* User Info y Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Stats del usuario */}
                            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                                <span>👥 Usuarios: {getTotalUsers()}</span>
                                <span>🟢 Online: {getOnlineUsers()}</span>
                            </div>

                            {/* Avatar y nombre */}
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-gray-700">
                                        {user?.name || user?.username}
                                    </p>
                                    <p className="text-xs text-gray-500">@{user?.username}</p>
                                </div>
                            </div>

                            {/* Logout */}
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 min-h-screen hidden lg:block">
                    <nav className="p-4 space-y-2">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${isActive
                                            ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-500'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}

                        {/* Chat separado */}
                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={() => navigate('/chat')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${location.pathname === '/chat'
                                        ? 'bg-green-50 text-green-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>Chat</span>
                                <span className="ml-auto bg-green-500 text-white text-xs rounded-full px-2 py-1">
                                    3
                                </span>
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>

            {/* Mobile Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="grid grid-cols-4 py-2">
                    {sidebarItems.slice(0, 4).map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`flex flex-col items-center py-2 px-3 ${isActive ? 'text-blue-600' : 'text-gray-600'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default Layout;