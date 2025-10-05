import React, { useState } from 'react';

interface UserDB {
    id: string;
    username: string;
    password: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    name: string;
    nickname?: string;
    avatar?: string;
    likes?: number;
    trophies?: any[];
    friends?: any[];
}

interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    name: string;
    nickname?: string;
    avatar?: string;
    likes?: number;
    trophies?: any[];
    friends?: any[];
}

interface LoginPageProps {
    onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        name: '',
        role: 'user'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
        if (error) setError('');
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
        if (error) setError('');
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Llamar a tu API real de Neon  
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password
                }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Login exitoso - usar datos de la base de datos
                const user: User = {
                    id: data.user.id.toString(),
                    username: data.user.username,
                    email: data.user.email,
                    role: data.user.userType === 'teacher' ? 'teacher' : 'student',
                    name: data.user.name || data.user.username,
                    nickname: data.user.username,
                    avatar: data.user.avatar || '',
                    likes: 0,
                    trophies: [],
                    friends: []
                };
                onLogin(user);
            } else {
                setError(data.error || 'Credenciales incorrectas');
            }
        } catch (err: any) {
            setError('Error de conexión con el servidor');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Por ahora, deshabilitar registro - solo usuarios existentes
            setError('El registro está deshabilitado. Use usuarios existentes: admin/admin123 o profesor/prof123');
        } catch (err: any) {
            setError(err.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <img src="/favicon.ico" alt="StoryUp.es" className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">StoryUp.es</h1>
                    <p className="text-gray-600">Red Social Educativa</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="flex mb-6">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 px-4 rounded-l-md ${isLogin
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 px-4 rounded-r-md ${!isLogin
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Registrarse
                    </button>
                </div>

                {isLogin ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email o Usuario
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="tu@email.com o tu_usuario"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Tu contraseña"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={registerData.name}
                                onChange={handleRegisterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Tu nombre completo"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre de Usuario
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={registerData.username}
                                onChange={handleRegisterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="tu_usuario_único"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="register-email"
                                name="email"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="register-password"
                                name="password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Crea una contraseña segura"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Usuario
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={registerData.role}
                                onChange={handleRegisterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="user">👨‍🎓 Estudiante/Usuario</option>
                                <option value="teacher">👨‍🏫 Padre/Docente</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Los Padres/Docentes tienen funciones adicionales de supervisión y creación de contenido educativo.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {loading ? 'Registrando...' : 'Crear Cuenta'}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 mb-2">
                        © 2025 StoryUp.es - Red Social Educativa Abierta
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            window.location.reload();
                        }}
                        className="text-xs text-gray-400 hover:text-gray-600 underline"
                        title="Reiniciar aplicación"
                    >
                        ¿Problemas? Reiniciar aplicación
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

