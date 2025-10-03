import React from 'react';
import { useAuth } from '../App';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8">
                {/* Mensaje de bienvenida */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        ¡Bienvenido a StoryUp.es, {user?.username || user?.name}! 👋
                    </h1>
                    <p className="text-xl text-gray-600 mb-6">
                        Tu red social educativa donde las historias cobran vida
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                        <p className="text-blue-800">
                            <strong>Rol:</strong> {user?.role === 'admin' ? '👨‍💼 Administrador' : '👨‍🏫 Docente/Padre'}
                        </p>
                    </div>
                </div>

                {/* 6 bloques de presentación */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Bloque 1: Historias */}
                    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <span className="text-2xl">📚</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 ml-3">Historias</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Descubre y comparte historias educativas que inspiran y enseñan.
                        </p>
                        <div className="flex items-center text-sm text-blue-600">
                            <span>Ver historias →</span>
                        </div>
                    </div>

                    {/* Bloque 2: Crear Historia */}
                    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <span className="text-2xl">✍️</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 ml-3">Crear Historia</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Crea tus propias historias educativas y compártelas con la comunidad.
                        </p>
                        <div className="flex items-center text-sm text-green-600">
                            <span>Crear ahora →</span>
                        </div>
                    </div>

                    {/* Bloque 3: Noticias */}
                    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <span className="text-2xl">📰</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 ml-3">Noticias</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Mantente al día con las últimas noticias y actualizaciones educativas.
                        </p>
                        <div className="flex items-center text-sm text-purple-600">
                            <span>Leer noticias →</span>
                        </div>
                    </div>

                    {/* Bloque 4: Concursos */}
                    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <span className="text-2xl">🏆</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 ml-3">Concursos</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Participa en concursos educativos y gana trofeos por tus logros.
                        </p>
                        <div className="flex items-center text-sm text-yellow-600">
                            <span>Ver concursos →</span>
                        </div>
                    </div>

                    {/* Bloque 5: Estadísticas */}
                    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="bg-red-100 p-3 rounded-full">
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 ml-3">Estadísticas</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Analiza tu progreso y el de la comunidad con estadísticas detalladas.
                        </p>
                        <div className="flex items-center text-sm text-red-600">
                            <span>Ver estadísticas →</span>
                        </div>
                    </div>

                    {/* Bloque 6: Chat Educativo */}
                    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="bg-indigo-100 p-3 rounded-full">
                                <span className="text-2xl">💬</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 ml-3">Chat Educativo</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Conecta y colabora con otros usuarios en un entorno educativo seguro.
                        </p>
                        <div className="flex items-center text-sm text-indigo-600">
                            <span>Abrir chat →</span>
                        </div>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        🌟 StoryUp.es - Más que una red social
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Para Estudiantes:</h3>
                            <ul className="space-y-1 text-sm">
                                <li>• Comparte tus historias y creatividad</li>
                                <li>• Aprende de manera interactiva</li>
                                <li>• Conecta con compañeros de forma segura</li>
                                <li>• Participa en concursos educativos</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Para Docentes y Padres:</h3>
                            <ul className="space-y-1 text-sm">
                                <li>• Supervisa el progreso educativo</li>
                                <li>• Crea contenido educativo de calidad</li>
                                <li>• Fomenta la colaboración positiva</li>
                                <li>• Herramientas anti-bullying integradas</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;