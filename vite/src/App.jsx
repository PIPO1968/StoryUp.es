import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import SidebarHistoria from './SidebarHistoria';
import CrearHistoria from './CrearHistoria';
import Perfil from './Perfil';
import Register from './Register';
import Login from './Login';
import LanguageSelector from './LanguageSelector';

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
