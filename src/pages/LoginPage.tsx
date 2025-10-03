import React, { useState } from 'react'; import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button'; import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input'; import { Input } from '@/components/ui/input';

import { loginUser } from '../lib/auth'; import { Alert, AlertDescription } from '@/components/ui/alert';

import { LogIn } from 'lucide-react'; import { loginUser } from '@/lib/auth';

import { useAuth } from '@/App';

export default function LoginPage({ onLogin }) {

    const [email, setEmail] = useState(''); const LoginPage: React.FC = () => {

        const [password, setPassword] = useState(''); const navigate = useNavigate();

        const [loading, setLoading] = useState(false); const { setUser } = useAuth();

        const [error, setError] = useState(''); const [formData, setFormData] = useState({

            email: '',

            const handleSubmit = async (e) => {
                password: '',

                    e.preventDefault();
            });

        setLoading(true); const [loading, setLoading] = useState(false);

        setError(''); const [error, setError] = useState('');



        try {
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

                const user = await loginUser({ email, password }); const { name, value } = e.target;

                onLogin(user); setFormData({ ...formData, [name]: value });

            } catch (err) {
                if (error) setError(''); // Limpiar error al escribir

                setError(err.message);
            };

        } finally {

            setLoading(false); const handleSubmit = async (e: React.FormEvent) => {

            }        e.preventDefault();

        }; setLoading(true);

        setError('');

        return (

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">        try {

                <Card className="w-full max-w-md">            const user = await loginUser(formData);

                    <CardHeader className="text-center">            setUser(user);

                        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">            navigate('/dashboard'); // Redirigir al dashboard tras login exitoso

                            <LogIn className="w-8 h-8 text-white" />        } catch (err: any) {

                    </div>            setError(err.message || 'Error al iniciar sesión');

                        <CardTitle className="text-2xl font-bold text-blue-600">        } finally {

                            Iniciar Sesión en StoryUp            setLoading(false);

                        </CardTitle>        }

                    </CardHeader>    };

                    <CardContent>

                        <form onSubmit={handleSubmit} className="space-y-4">    return (

                            <div>        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">

                                <Input            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">

                                    type="email"                <div className="text-center mb-6">

                                        value={email}                    <h1 className="text-3xl font-bold text-blue-600">StoryUp</h1>

                                        onChange={(e) => setEmail(e.target.value)}                    <p className="text-gray-600 mt-2">Iniciar Sesión</p>

                                        placeholder="Email"                </div>

                                    required

                            />                {error && (

                        </div>                    <Alert variant="destructive" className="mb-4">

                                    <AlertDescription>{error}</AlertDescription>

                                    <div>                    </Alert>

                                <Input                )}

                                type="password"

                                value={password}                <form onSubmit={handleSubmit} className="space-y-4">

                                    onChange={(e) => setPassword(e.target.value)}                    <div>

                                        placeholder="Contraseña"                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">

                                            required                            Email

                            />                        </label>

                                    </div>                        <Input

                                        id="email"

                                        {error && (name = "email"

                                            < div className="text-red-600 text-sm text-center">                            type="email"

                                        {error}                            value={formData.email}

                                    </div>                            onChange={handleChange}

                        )}                            required

                                    disabled={loading}

                                    <Button placeholder="tu@email.com"

                                        type="submit" />

                                    className="w-full bg-blue-600 hover:bg-blue-700"                    </div>

                            disabled={loading}                    <div>

                        >                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">

                                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}                            Contraseña

                                </Button>                        </label>

                        </form>                        <Input

                </CardContent>                            id="password"

                </Card>                            name="password"

            </div>                            type = "password"

    ); value = { formData.password }

} onChange = { handleChange }
required
disabled = { loading }
placeholder = "Tu contraseña"
    />
                    </div >
    <Button
        type="submit"
        className="w-full"
        disabled={loading}
    >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
    </Button>
                </form >

    <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <button
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:text-blue-800 font-medium"
            >
                Regístrate aquí
            </button>
        </p>
    </div>
            </div >
        </div >
    );
};

export default LoginPage;