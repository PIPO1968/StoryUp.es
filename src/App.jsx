import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './lib/auth.ts';
import Layout from './components/LayoutSimple.tsx';
import LoginPage from './pages/LoginPage.tsx';
import { LanguageProvider } from './lib/LanguageContext.tsx';

import Dashboard from './pages/Dashboard.tsx';
import StoriesPageNew from './pages/StoriesPageNew.tsx';
import StoryDetailPage from './pages/StoryDetailPage.tsx';
import CreateStoryPage from './pages/CreateStoryPage.tsx';
import NewsPage from './pages/NewsPage.tsx';
import NewsDetailPage from './pages/NewsDetailPage.tsx';
import CreateNewsPage from './pages/CreateNewsPage.tsx';
import StatisticsPage from './pages/StatisticsPage.tsx';
import ContestsPage from './pages/ContestsPage.tsx';
import ProfilePageNew from './pages/ProfilePageNew.tsx';
import ChatPage from './pages/ChatPage.tsx';
import './App.css';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    // Inicialización robusta de datos críticos
    useEffect(() => {
        const initializeCriticalData = () => {
            // Verificar y restaurar lista de usuarios si está vacía
            const existingUsers = localStorage.getItem('storyup_users');
            if (!existingUsers || JSON.parse(existingUsers).length === 0) {
                console.log('🔄 Inicializando datos críticos: Lista de usuarios');
                const defaultUsers = [
                    { id: '1', username: 'ADMIN', name: 'Administrador', userType: 'padre-docente', email: 'admin@storyup.es' },
                    { id: '2', username: 'PIPO68', name: 'Pipo Rodriguez Rodriguez', userType: 'usuario', email: 'pipocanarias@hotmail.com' },
                    { id: '3', username: 'usuario.ejemplo', name: 'Usuario Ejemplo', userType: 'usuario', email: 'ejemplo@storyup.es' },
                    { id: '4', username: 'maria.lopez', name: 'María López', userType: 'usuario', email: 'maria@storyup.es' },
                    { id: '5', username: 'juan.garcia', name: 'Juan García', userType: 'padre-docente', email: 'juan@storyup.es' }
                ];
                localStorage.setItem('storyup_users', JSON.stringify(defaultUsers));
                console.log('✅ Lista de usuarios inicializada:', defaultUsers.length, 'usuarios');
            }

            // Inicializar estadísticas para PIPO68 si no existen
            const pipo68Stats = localStorage.getItem('storyup_user_stats_PIPO68');
            if (!pipo68Stats) {
                console.log('🔄 Inicializando estadísticas para PIPO68');
                const initialStats = {
                    userId: 'PIPO68',
                    friends: 0,
                    trophies: 0,
                    stories: 1, // 1 historia creada (dato real)
                    likes: {
                        fromStories: 1, // 1 like recibido (dato real)
                        fromTrophies: 0,
                        fromContests: 0,
                        fromAdmin: 0,
                        total: 1
                    },
                    globalPosition: 1,
                    lastUpdated: new Date().toISOString()
                };
                localStorage.setItem('storyup_user_stats_PIPO68', JSON.stringify(initialStats));
                console.log('✅ Estadísticas PIPO68 inicializadas');
            }
        };

        initializeCriticalData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
    }

    if (user) {
        return (
            <LanguageProvider>
                <AuthContext.Provider value={{ user, setUser }}>
                    <Router>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/stories" element={<StoriesPageNew />} />
                                <Route path="/story/:storyId" element={<StoryDetailPage />} />
                                <Route path="/create" element={<CreateStoryPage />} />
                                <Route path="/news" element={<NewsPage />} />
                                <Route path="/news/:newsId" element={<NewsDetailPage />} />
                                <Route path="/create-news" element={<CreateNewsPage />} />
                                <Route path="/contests" element={<ContestsPage />} />
                                <Route path="/statistics" element={<StatisticsPage />} />
                                <Route path="/profile" element={<ProfilePageNew />} />
                                <Route path="/chat" element={<ChatPage />} />
                            </Routes>
                        </Layout>
                    </Router>
                </AuthContext.Provider>
            </LanguageProvider>
        );
    }

    return (
        <LanguageProvider>
            <AuthContext.Provider value={{ user, setUser }}>
                <LoginPage onLogin={setUser} />
            </AuthContext.Provider>
        </LanguageProvider>
    );
}

export default App;