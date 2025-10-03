import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const WelcomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center py-12">
                    <h1 className="text-5xl font-bold text-blue-600 mb-4">StoryUp</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Red social moderna para chatear, crear grupos y compartir experiencias
                    </p>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="text-3xl mb-4">💬</div>
                        <h3 className="text-lg font-semibold mb-2">Chat en tiempo real</h3>
                        <p className="text-gray-600">Envía y recibe mensajes instantáneos con tus amigos y grupos.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="text-3xl mb-4">👥</div>
                        <h3 className="text-lg font-semibold mb-2">Grupos personalizados</h3>
                        <p className="text-gray-600">Crea, administra y únete a grupos para compartir intereses.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="text-3xl mb-4">🔒</div>
                        <h3 className="text-lg font-semibold mb-2">Privacidad y seguridad</h3>
                        <p className="text-gray-600">Tus datos y conversaciones están protegidos y son privados.</p>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="text-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
                        <h2 className="text-2xl font-bold mb-6">¡Únete a StoryUp!</h2>
                        <div className="space-y-4">
                            <Link to="/register" className="block">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                                    Crear cuenta
                                </Button>
                            </Link>
                            <Link to="/login" className="block">
                                <Button variant="outline" className="w-full py-3 text-lg">
                                    Iniciar sesión
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="text-center mt-12 text-gray-500">
                    <p>© 2025 StoryUp.es · <a href="mailto:contacto@storyup.es" className="text-blue-600 hover:underline">Contacto</a></p>
                </footer>
            </div>
        </div>
    );
};

export default WelcomePage;