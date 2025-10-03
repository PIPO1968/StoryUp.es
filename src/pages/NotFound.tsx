import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center">
            <div className="space-y-6 max-w-md">
                <div className="flex items-center justify-center space-x-3 mb-8">
                    <img
                        src="/assets/logo-grande.png.png"
                        alt="StoryUp Logo"
                        className="h-16 w-16 object-contain opacity-50"
                    />
                </div>

                <div className="space-y-3">
                    <h1 className="text-8xl font-bold text-blue-600">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-800">Página No Encontrada</h2>
                    <p className="text-muted-foreground">
                        La página que buscas no existe o puede haber sido movida.
                        Vuelve al inicio para continuar explorando StoryUp.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={() => navigate('/')} className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Volver al Inicio
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Atrás
                    </Button>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                        ¿Necesitas ayuda? Visita nuestra sección de
                        <button
                            onClick={() => navigate('/news')}
                            className="font-medium underline ml-1 hover:text-blue-800"
                        >
                            noticias y anuncios
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

