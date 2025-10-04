import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../App';

// Importar interfaz User
interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    nickname?: string;
    name?: string;
    avatar?: string;
    likes?: number;
    trophies?: any[];
    friends?: any[];
}

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',           // Nombre real
        username: '',       // Nick
        userType: '',       // Usuario o Padre/Docente
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (error) setError(''); // Limpiar error al escribir
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, userType: value });
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validaciones
        if (!formData.name.trim()) {
            setError('El nombre real es obligatorio');
            setLoading(false);
            return;
        }

        if (!formData.username.trim()) {
            setError('El nombre de usuario (nick) es obligatorio');
            setLoading(false);
            return;
        }

        if (!formData.userType) {
            setError('Debe seleccionar si es Usuario o Padre/Docente');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    username: formData.username.trim(),
                    userType: formData.userType,
                    email: formData.email.trim(),
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear la cuenta');
            }

            // Registro exitoso - registrar IP y login automático
            try {
                // Registrar la IP como conocida
                await fetch('/api/check-ip', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            } catch (ipError) {
                console.error('Error registrando IP:', ipError);
                // Continuar aunque falle el registro de IP
            }

            // Login automático y redirigir al dashboard
            const user: User = {
                id: data.user.id,
                username: data.user.username,
                email: data.user.email,
                role: data.user.userType === 'Padre/Docente' ? 'teacher' : 'student',
                name: data.user.name,
                nickname: data.user.username,
                avatar: data.user.avatar || '',
                likes: 0,
                trophies: [],
                friends: []
            };
            setUser(user);
            // No necesita navigate porque setUser ya cambiará la vista al dashboard
        } catch (err: any) {
            setError(err.message || 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center mb-6">
                    <img src="/favicon.ico" alt="StoryUp.es" className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-blue-600">StoryUp</h1>
                    <p className="text-gray-600 mt-2">¡Bienvenido! Crea tu cuenta</p>
                    <p className="text-sm text-gray-500 mt-1">Es tu primera vez aquí</p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre Real *
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="Tu nombre completo"
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de Usuario (Nick) *
                        </label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="tu_usuario"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Usuario *
                        </label>
                        <Select onValueChange={handleSelectChange} disabled={loading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona tu tipo de usuario" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Usuario">Usuario</SelectItem>
                                <SelectItem value="Padre/Docente">Padre/Docente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>

                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña *
                        </label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar Contraseña *
                        </label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="Repite tu contraseña"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        ¿Ya tienes cuenta?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-blue-600 hover:text-blue-800 font-medium underline"
                        >
                            Inicia sesión aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

