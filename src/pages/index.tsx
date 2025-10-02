import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/auth';

export default function WelcomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirigir automáticamente basado en el estado de autenticación
        const user = getCurrentUser();
        if (user) {
            navigate('/feed');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center">
            <div className="space-y-8 max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center justify-center space-x-3 mb-8">
                    <img
                        src="/assets/logo-grande.png.png"
                        alt="StoryUp Logo"
                        className="h-16 w-16 object-contain"
                    />
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        StoryUp
                    </h1>
                </div>

                <p className="text-lg text-muted-foreground animate-in fade-in delay-300 duration-700">
                    Conectando comunidades educativas a través de historias
                </p>
            </div>

            <div className="flex items-center justify-between space-x-6">
                <img
                    src="/assets/logo-grande.png.png"
                    alt="StoryUp Logo"
                    className="h-16 w-16 object-contain"
                />
                {/* Bloque de tablón de anuncios */}
                <div className="border-2 border-gray-300 bg-white shadow-md rounded-lg p-6 w-1/2">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">📢 Tablón de Anuncios</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li className="text-gray-700">Anuncio 1: Bienvenidos a StoryUp.</li>
                        <li className="text-gray-700">Anuncio 2: Próxima reunión el viernes.</li>
                        <li className="text-gray-700">Anuncio 3: Actualización de la plataforma completada.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}