import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@/lib/auth';

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

                <div className="animate-in fade-in delay-500 duration-700">
                    <div className="inline-flex items-center justify-center w-8 h-8 border-2 border-blue-600 rounded-full animate-spin">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Cargando...</p>
                </div>
            </div>
        </div>
    );
}