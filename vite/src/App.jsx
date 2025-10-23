import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import SidebarHistoria from './SidebarHistoria.jsx';
import CrearHistoria from './CrearHistoria.jsx';
import Perfil from './Perfil.jsx';
import Register from './Register.jsx';
import Login from './Login.jsx';
import LanguageSelector from './LanguageSelector.jsx';

function App() {
    return (
        <div>
            <Sidebar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/crear-historia" element={<CrearHistoria />} />
                {/* Agrega más rutas según tu app */}
            </Routes>
            <LanguageSelector />
        </div>
    );
}

export default App;
