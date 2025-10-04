import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
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



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <img src="/favicon.ico" alt="StoryUp.es" className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">StoryUp.es</h1>
                    <p className="text-gray-600">¡Bienvenido de vuelta!</p>
                    <p className="text-sm text-gray-500 mt-1">Inicia sesión con tu cuenta</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}



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

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        ¿No tienes cuenta?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-blue-600 hover:text-blue-800 font-medium underline"
                        >
                            Regístrate aquí
                        </button>
                    </p>
                </div>

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

