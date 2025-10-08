import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Tipos para el contexto de autenticación
interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    nickname?: string;
    name?: string;
    avatar?: string;
    likes?: number;
    trophies?: any[];
    friends?: any[];
    theme?: 'dark' | 'light' | 'system';
    language?: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// ...eliminado USERS_DB, ahora la autenticación será vía API

import { getCurrentUser } from './lib/auth.ts';

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Al montar, consulta el usuario actual usando JWT
        (async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            setLoading(false);
            // Si hay usuario, marcarlo como online
            if (currentUser) {
                await fetch('/api/online', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: currentUser.id })
                });
                // Mantener online con ping cada 5 min y en cada interacción
                const pingOnline = () => {
                    fetch('/api/online', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: currentUser.id })
                    });
                };
                window.addEventListener('click', pingOnline);
                window.addEventListener('keydown', pingOnline);
                const interval = setInterval(pingOnline, 5 * 60 * 1000);
                // Limpiar listeners y ping al desmontar
                return () => {
                    window.removeEventListener('click', pingOnline);
                    window.removeEventListener('keydown', pingOnline);
                    clearInterval(interval);
                    fetch('/api/online', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: currentUser.id })
                    });
                };
            }
        })();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
    }

    if (user) {
        return (
            <AuthContext.Provider value={{ user, setUser }}>
                <LanguageProvider>
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
                </LanguageProvider>
            </AuthContext.Provider>
        );
    }

    // No hay usuario logueado - mostrar login
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            <LanguageProvider>
                <LoginPage onLogin={setUser} />
            </LanguageProvider>
        </AuthContext.Provider>
    );
}

export default App;