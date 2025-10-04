
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
                // Obtener token JWT del almacenamiento local
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setUser(null);
                    setLoading(false);
                    return;
                }
                // Consultar usuario real desde la API usando el token
                const res = await fetch('/api/auth', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error loading user:', error);
                setUser(null);
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