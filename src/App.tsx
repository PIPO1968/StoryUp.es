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
    token: string | null;
    setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// ...eliminado USERS_DB, ahora la autenticación será vía API

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await fetch('/api/auth', {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await res.json();
                if (data.user) {
                    setUser(data.user);
                    setToken(data.token || null);
                } else {
                    setUser(null);
                    setToken(null);
                }
            } catch (error) {
                console.error('Error loading user:', error);
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
    }

    if (user) {
        return (
            <LanguageProvider>
                <AuthContext.Provider value={{ user, setUser, token, setToken }}>
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
            <AuthContext.Provider value={{ user, setUser, token, setToken }}>
                <LoginPage onLogin={setUser} />
            </AuthContext.Provider>
        </LanguageProvider>
    );
}

export default App;