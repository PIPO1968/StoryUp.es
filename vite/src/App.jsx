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
            <Sidebar onLogout={() => { }} />
            <Routes>
                <Route path="/" element={<Login onLogin={() => { }} />} />
                <Route path="/register" element={<Register onRegister={() => { }} />} />
                <Route path="/perfil" element={<Perfil usuario={{}} setUsuario={() => { }} />} />
                <Route path="/crear-historia" element={<CrearHistoria usuario={{}} />} />
                {/* Agrega más rutas según tu app */}
            </Routes>
            <LanguageSelector lang="es" setLang={() => { }} />
        </div>
    );
}

export default App;
