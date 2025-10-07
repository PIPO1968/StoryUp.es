import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
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
                {/* Main Content - Sin sidebar */}
                <main className="py-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;