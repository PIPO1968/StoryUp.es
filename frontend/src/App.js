// Forzar redeploy Vercel 21/10/2025
import React from 'react';

import Register from './Register';
import Login from './Login';
import Perfil from './Perfil';
import CrearHistoria from './CrearHistoria';
import StoriesPage from './pages/StoriesPage';
import NoticiasPage from './pages/NoticiasPage';
import ConcursosPage from './pages/ConcursosPage';
import StoryDetailPage from './pages/StoryDetailPage';
import { Routes, Route } from 'react-router-dom';
import './App.css';


export default function App() {
    return (
        <div style={{ minHeight: '100vh', background: '#fffbe6' }}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/crear-historia" element={<CrearHistoria />} />
                <Route path="/historias" element={<StoriesPage />} />
                <Route path="/noticias" element={<NoticiasPage />} />
                <Route path="/concursos" element={<ConcursosPage />} />
                <Route path="/stories/:id" element={<StoryDetailPage />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </div>
    );
}
