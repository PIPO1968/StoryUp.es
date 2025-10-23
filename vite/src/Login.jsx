

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://storyup-backend.onrender.com/api';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        name: '',
        role: 'student',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/register-or-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    username: isRegister ? formData.username : undefined,
                    name: isRegister ? formData.name : undefined,
                    role: isRegister ? formData.role : undefined
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error de autenticación');
            navigate('/perfil');
        } catch (err) {
            setError(err.message);
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
                        onClick={() => setIsRegister(false)}
                        className={`flex-1 py-2 px-4 rounded-l-md ${!isRegister ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => setIsRegister(true)}
                        className={`flex-1 py-2 px-4 rounded-r-md ${isRegister ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        Registrarse
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border rounded px-2 py-1"
                                    placeholder="Tu nombre completo"
                                    required={isRegister}
                                />
                            </div>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Nombre de Usuario</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full border rounded px-2 py-1"
                                    placeholder="tu_usuario_único"
                                    required={isRegister}
                                />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuario</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full border rounded px-2 py-1"
                                >
                                    <option value="student">👨‍🎓 Estudiante/Usuario</option>
                                    <option value="teacher">👨‍🏫 Padre/Docente</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                        </>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border rounded px-2 py-1"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border rounded px-2 py-1"
                            placeholder="Crea una contraseña segura"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded">
                        {loading ? (isRegister ? 'Registrando...' : 'Iniciando sesión...') : (isRegister ? 'Crear Cuenta' : 'Iniciar Sesión')}
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 mb-2">© 2025 StoryUp.es - Red Social Educativa Abierta</p>
                    <button type="button" onClick={() => navigate('/')} className="text-blue-600 hover:underline">Volver al inicio</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
