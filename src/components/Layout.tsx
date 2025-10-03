import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from '@/components/ui/button';
import LanguageSelector from './LanguageSelector';
import { getUserStats } from '../lib/auth';
import {
    Home,
    MessageCircle,
    Plus,
    User,
    Settings,
    LogOut,
    Search,
    Bell,
    Bookmark,
    BookOpen,
    BarChart3,
    Newspaper,
    PlusCircle
} from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [lang, setLang] = React.useState('es');
    const [currentTime, setCurrentTime] = React.useState(new Date());
    const [userStats, setUserStats] = React.useState(getUserStats());

    // Update time every second
    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatMadridTime = (date: Date) => {
        return date.toLocaleString('es-ES', {
            timeZone: 'Europe/Madrid',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
        navigate('/');
    };

    const sidebarItems = [
        { icon: Home, label: 'Inicio', path: '/dashboard' },
        { icon: BookOpen, label: 'Historias', path: '/stories' },
        { icon: PlusCircle, label: 'Crear Historia', path: '/create' },
        { icon: Newspaper, label: 'Noticias', path: '/news' },
        { icon: Settings, label: 'Concurso y trofeos', path: '/contests' },
        { icon: BarChart3, label: 'Estadísticas', path: '/statistics' },
        { icon: User, label: 'Perfil', path: '/profile' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-blue-600">StoryUp</h1>
                        </div>

                        {/* Header Info as specified: Logo, Users, Online, Date/Time, Language */}
                        <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                                <span>👥 Usuarios: {userStats.totalUsers}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span>🟢 Online: {userStats.onlineUsers}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>🌍 Madrid:</span>
                                <span className="font-mono">{formatMadridTime(currentTime)}</span>
                            </div>
                        </div>

                        {/* User Menu and Language Selector */}
                        <div className="flex items-center space-x-4">
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
                            <LanguageSelector lang={lang} setLang={setLang} />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex">
                    {/* Sidebar */}
                    <aside className="w-64 py-6 pr-8 hidden lg:block">
                        <nav className="space-y-2">
                            {sidebarItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => navigate(item.path)}
                                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}

                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Cerrar sesión</span>
                                </button>
                            </div>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 py-6">
                        {children}
                    </main>

                    {/* Right Sidebar (Suggestions, etc.) */}
                    <aside className="w-80 py-6 pl-8 hidden xl:block">
                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <h3 className="text-lg font-semibold mb-4">Sugerencias para ti</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Usuario Sugerido</p>
                                        <p className="text-xs text-gray-500">@usuario123</p>
                                    </div>
                                    <Button size="sm" variant="outline">Seguir</Button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border mt-6">
                            <h3 className="text-lg font-semibold mb-4">Tendencias</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium">#StoryUpChallenge</p>
                                    <p className="text-xs text-gray-500">2,543 historias</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">#CreatividadDigital</p>
                                    <p className="text-xs text-gray-500">1,234 historias</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">#EducaciónOnline</p>
                                    <p className="text-xs text-gray-500">856 historias</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="flex justify-around py-2">
                    {sidebarItems.slice(0, 5).map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className="flex flex-col items-center py-2 px-3 text-gray-600"
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-xs mt-1">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default Layout;