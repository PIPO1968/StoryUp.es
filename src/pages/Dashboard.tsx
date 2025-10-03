import React from 'react';
import { useAuth } from '../App';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Bienvenido a StoryUp.es, {user?.name || user?.username}!
                    </h1>
                    {user?.role === 'admin' && (
                        <div className="border-l-4 bg-red-50 border-red-400 p-4 rounded">
                            <p className="text-red-800"><strong>Rol:</strong> Administrador del Sistema</p>
                        </div>
                    )}
                    {user?.role === 'teacher' && (
                        <div className="border-l-4 bg-green-50 border-green-400 p-4 rounded">
                            <p className="text-green-800"><strong>Rol:</strong> Padre/Docente</p>
                        </div>
                    )}
                    {(!user?.role || user?.role === 'user') && (
                        <div className="border-l-4 bg-blue-50 border-blue-400 p-4 rounded">
                            <p className="text-blue-800"><strong>Rol:</strong> Estudiante/Usuario</p>
                        </div>
                    )}
                </div>

                {/* Contenido específico por rol */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user?.role === 'admin' && (
                        <>
                            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-red-100 p-3 rounded-full">
                                        <span className="text-2xl">⚙️</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 ml-3">Panel Admin</h3>
                                </div>
                                <p className="text-gray-600">Gestiona usuarios, permisos y configuración del sistema.</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-orange-100 p-3 rounded-full">
                                        <span className="text-2xl">📈</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 ml-3">Analytics</h3>
                                </div>
                                <p className="text-gray-600">Estadísticas avanzadas de uso y rendimiento.</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <span className="text-2xl">🔧</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 ml-3">Moderación</h3>
                                </div>
                                <p className="text-gray-600">Herramientas de moderación de contenido.</p>
                            </div>
                        </>
                    )}

                    {user?.role === 'teacher' && (
                        <>
                            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 ml-3">Supervisión</h3>
                                </div>
                                <p className="text-gray-600">Supervisa la actividad de los estudiantes.</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <span className="text-2xl">📝</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 ml-3">Contenido Educativo</h3>
                                </div>
                                <p className="text-gray-600">Crea y gestiona contenido educativo.</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-yellow-100 p-3 rounded-full">
                                        <span className="text-2xl">🛡️</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 ml-3">Anti-Bullying</h3>
                                </div>
                                <p className="text-gray-600">Herramientas de prevención y gestión.</p>
                            </div>
                        </>
                    )}

                    {(!user?.role || user?.role === 'user') && (
                        <>
                            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <span className="text-2xl">📚</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 ml-3">Mis Historias</h3>
                                </div>
                                <p className="text-gray-600">Lee y comparte historias educativas.</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <span className="text-2xl">✍️</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 ml-3">Crear Historia</h3>
                                </div>
                                <p className="text-gray-600">Expresa tu creatividad escribiendo historias.</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <span className="text-2xl">🎮</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 ml-3">Actividades</h3>
                                </div>
                                <p className="text-gray-600">Participa en juegos educativos.</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-indigo-100 p-3 rounded-full">
                                        <span className="text-2xl">💬</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 ml-3">Chat Estudiantil</h3>
                                </div>
                                <p className="text-gray-600">Conecta con otros estudiantes de forma segura.</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-yellow-100 p-3 rounded-full">
                                        <span className="text-2xl">🏆</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 ml-3">Mis Logros</h3>
                                </div>
                                <p className="text-gray-600">Ve tus logros y progreso en la plataforma.</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-pink-100 p-3 rounded-full">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 ml-3">Mi Perfil</h3>
                                </div>
                                <p className="text-gray-600">Personaliza tu perfil y conecta con otros.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
