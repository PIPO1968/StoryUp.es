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
        <>
            <header className="top-bar">
                <div className="top-bar-left">
                    <span className="usuarios-total">👥 Usuarios: {totalUsuarios !== null ? totalUsuarios : '—'}</span>
                </div>
                <div className="top-bar-center"></div>
                <div className="top-bar-right"></div>
            </header>
            <div className="main-layout">
            {/* Bloque blanco con características a la izquierda */}
            <div className="features-block">
                <div className="features">
                    <div className="feature-card">
                        <span className="feature-icon">💬</span>
                        <h3>Chat en tiempo real</h3>
                        <p>Envía y recibe mensajes instantáneos con tus amigos y grupos.</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">👥</span>
                        <h3>Grupos personalizados</h3>
                        <p>Crea, administra y únete a grupos para compartir intereses.</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">🔒</span>
                        <h3>Privacidad y seguridad</h3>
                        <p>Tus datos y conversaciones están protegidos y son privados.</p>
                    </div>
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
        </>
    );
}

export default App;
