

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { loginUser, registerUser } from '../lib/auth';

function Login() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        name: '',
        role: 'student'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
        if (error) setError('');
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
        if (error) setError('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // const { user, token } = await loginUser(loginData);
            // onLogin({ ...user, token });
            navigate('/dashboard');
        } catch (err) {
            setError('Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // const { user, token } = await registerUser(registerData);
            // onLogin({ ...user, token });
            navigate('/dashboard');
        } catch (err) {
            setError('Error al registrarse');
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
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">{error}</div>
                )}
                <div className="flex mb-6">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 px-4 rounded-l-md ${isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 px-4 rounded-r-md ${!isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        Registrarse
                    </button>
                </div>
                {isLogin ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email o Usuario</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded">
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={registerData.name}
                                onChange={handleRegisterChange}
                                className="w-full border rounded px-2 py-1"
                                placeholder="Tu nombre completo"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Nombre de Usuario</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={registerData.username}
                                onChange={handleRegisterChange}
                                className="w-full border rounded px-2 py-1"
                                placeholder="tu_usuario_único"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                id="register-email"
                                name="email"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                className="w-full border rounded px-2 py-1"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                            <input
                                type="password"
                                id="register-password"
                                name="password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                className="w-full border rounded px-2 py-1"
                                placeholder="Crea una contraseña segura"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuario</label>
                            <select
                                id="role"
                                name="role"
                                value={registerData.role}
                                onChange={handleRegisterChange}
                                className="w-full border rounded px-2 py-1"
                            >
                                <option value="student">👨‍🎓 Estudiante/Usuario</option>
                                <option value="teacher">👨‍🏫 Padre/Docente</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 px-4 rounded">
                            {loading ? 'Registrando...' : 'Crear Cuenta'}
                        </button>
                    </form>
                )}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 mb-2">© 2025 StoryUp.es - Red Social Educativa Abierta</p>
                    <button type="button" onClick={() => navigate('/')} className="text-blue-600 hover:underline">Volver al inicio</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
