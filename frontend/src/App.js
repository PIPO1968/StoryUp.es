import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './App.css';

function App() {
    const [usuario, setUsuario] = useState(null);
    const [mostrarRegistro, setMostrarRegistro] = useState(false);

    return (
        <div className="app-container">
            <img src="/logo.png" alt="Logo StoryUp.es" className="logo-img" />
            <div className="logo">StoryUp.es</div>
            <div className="descripcion">
                Red social moderna para chatear, crear grupos y compartir con amigos.
            </div>
            {!usuario ? (
                <>
                    {mostrarRegistro ? (
                        <Register onRegister={setUsuario} />
                    ) : (
                        <Login onLogin={setUsuario} />
                    )}
                    <button onClick={() => setMostrarRegistro(!mostrarRegistro)}>
                        {mostrarRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                    </button>
                </>
            ) : (
                <div>
                    <p>¡Bienvenido, {usuario.nombre}!</p>
                    <p>Ya puedes acceder al chat y grupos.</p>
                </div>
            )}
        </div>
    );
}

export default App;
