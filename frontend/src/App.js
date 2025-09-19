import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import './App.css';


function App() {
    const [usuario, setUsuario] = useState(null);
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
    const [totalUsuarios, setTotalUsuarios] = useState(null);

    useEffect(() => {
        fetch('/api/usuarios/total')
            .then(res => res.json())
            .then(data => setTotalUsuarios(data.total))
            .catch(() => setTotalUsuarios('—'));
    }, []);

    return (
        <div className="main-layout">
            {/* Bloque blanco con características a la izquierda */}
            <div className="features-block">
                <div className="features">
                    <div className="feature-card feature-inline"><span className="feature-icon">💬</span> Chat en tiempo real</div>
                    <div className="feature-card feature-inline"><span className="feature-icon">👥</span> Grupos personalizados</div>
                    <div className="feature-card feature-inline"><span className="feature-icon">🔒</span> Privacidad y seguridad</div>
                    <div className="feature-card feature-inline"><span className="feature-icon">🌍</span> Comunidad global</div>
                    <div className="feature-card feature-inline"><span className="feature-icon">🏆</span> Logros y recompensas</div>
                </div>
            </div>
            {/* Login centrado sobre fondo gris */}
            <div className="login-block">
                <img src="/login-icon.png" alt="Icono login StoryUp.es" className="logo-img" />
                <div className="logo">StoryUp.es</div>
                <div className="descripcion">
                    <strong>(PARA USUARIOS PARTICULARES)</strong><br />
                    Red social moderna y diferente para chatear, crear grupos y compartir experiencias con personas de todo el mundo. ¡Conéctate, haz amigos y disfruta de una comunidad segura y divertida!<br /><br />
                    <strong>(PARA DOCENTES Y ESCOLARES)</strong><br />
                    Herramienta social y educativa para centros escolares: multilingüe, colaborativa y con enfoque anti-bullying. Fomenta la comunicación, el aprendizaje y la convivencia positiva en el aula y más allá.
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
                <footer className="footer">
                    <span>© 2025 StoryUp.es · <a href="mailto:contacto@storyup.es">Contacto</a></span>
                </footer>
            </div>
            {/* Imagen a la derecha del login */}
            <div className="image-block">
                <img src="/logo-grande.png" alt="Logo grande StoryUp.es" className="side-image" />
            </div>
        </div>
    );
}

export default App;
