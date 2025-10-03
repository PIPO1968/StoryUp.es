import React, { useState } from 'react'; import React, { useState } from 'react'; import React, { useState } from 'react'; import React, { useState } from 'react';

import { loginUser } from '../lib/auth';

import { loginUser } from '../lib/auth';

interface LoginPageProps {

    onLogin: (user: any) => void;import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; import { useNavigate } from 'react-router-dom';

}

interface LoginPageProps {

    const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {

    const[formData, setFormData] = useState({    onLogin: (user: any) => void; import { Button } from '@/components/ui/button'; import { Button } from '@/components/ui/button';

    username: '',

    password: ''}

    });

    const [loading, setLoading] = useState(false);import { Input } from '@/components/ui/input'; import { Input } from '@/components/ui/input';

const [error, setError] = useState('');

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target; const [formData, setFormData] = useState({
            import { loginUser } from '../lib/auth'; import { Alert, AlertDescription } from '@/components/ui/alert';

            setFormData({ ...formData, [name]: value });

        if(error) setError('');        username: '',

        };

        password: ''import { LogIn } from 'lucide-react'; import { loginUser } from '@/lib/auth';

        const handleSubmit = async (e: React.FormEvent) => {

            e.preventDefault();
        });

        setLoading(true);

        setError(''); const [loading, setLoading] = useState(false); import { useAuth } from '@/App';



        try {
            const [error, setError] = useState('');

            const user = await loginUser({

                email: formData.username, export default function LoginPage({ onLogin }) {

                password: formData.password

            }); const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

                onLogin(user);

            } catch (err: any) {
                const { name, value } = e.target; const [email, setEmail] = useState(''); const LoginPage: React.FC = () => {

                    setError(err.message || 'Error al iniciar sesión');

                } finally {
                    setFormData({ ...formData, [name]: value });

                    setLoading(false);

                } if (error) setError(''); // Limpiar error al escribir        const [password, setPassword] = useState(''); const navigate = useNavigate();

            };

        };

        const handleQuickLogin = async (username: string, password: string) => {

            setLoading(true); const [loading, setLoading] = useState(false); const { setUser } = useAuth();

            setError('');

            const handleSubmit = async (e: React.FormEvent) => {

                try {

                    const user = await loginUser({
                        e.preventDefault(); const [error, setError] = useState(''); const [formData, setFormData] = useState({

                            email: username === 'PIPO68' ? 'pipocanarias@hotmail.com' : 'piporgz68@gmail.com',

                            password: password        setLoading(true);

                        });

                        onLogin(user);        setError('');            email: '',

                    } catch (err: any) {

                        setError(err.message || 'Error al iniciar sesión');

                    } finally {

                        setLoading(false); try {
                            const handleSubmit = async (e) => {

                            }

                        }; const user = await loginUser({
                            password: '',



                            return(email: formData.username,

        <div className = "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" >

            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">                password: formData.password                    e.preventDefault();

                <div className="text-center mb-8">

                    <img src="/favicon.ico" alt="StoryUp.es" className="w-16 h-16 mx-auto mb-4" />            });            });

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">StoryUp.es</h1>

                    <p className="text-gray-600">Red Social Educativa</p>            onLogin(user);

                </div>

        } catch (err: any) {        setLoading(true); const [loading, setLoading] = useState(false);

                {error && (

                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">            setError(err.message || 'Error al iniciar sesión');

                        {error}

                    </div>        } finally {        setError(''); const [error, setError] = useState('');

                )}

            setLoading(false);

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">

                    <div>        }

                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">

                            Usuario o Email    };

                        </label>

                        <input        try {

                            type="text"

                            id="username"    // Login rápido con botones predefinidos            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

                            name="username"

                            value={formData.username}    const handleQuickLogin = async (username: string, password: string) => {

                            onChange={handleChange}

                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"        setLoading(true);                const user = await loginUser({ email, password }); const { name, value } = e.target;

                            placeholder="PIPO68 o piporgz68"

                            required        setError('');

                        />

                    </div>                        onLogin(user); setFormData({ ...formData, [name]: value });



                    <div>        try {

                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">

                            Contraseña            const user = await loginUser({            } catch (err) {

                        </label>

                        <input                email: username === 'PIPO68' ? 'pipocanarias@hotmail.com' : 'piporgz68@gmail.com',                if (error) setError(''); // Limpiar error al escribir

                            type="password"

                            id="password"                password: password

                            name="password"

                            value={formData.password}            });                setError(err.message);

                            onChange={handleChange}

                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"            onLogin(user);            };

                            placeholder="Ingresa tu contraseña"

                            required        } catch (err: any) {

                        />

                    </div>            setError(err.message || 'Error al iniciar sesión');        } finally {



                    <button        } finally {

                        type="submit"

                        disabled={loading}            setLoading(false);            setLoading(false); const handleSubmit = async (e: React.FormEvent) => {

                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"

                    >        }

                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}

                    </button>    };            }        e.preventDefault();

                </form>



                <div className="border-t pt-6">

                    <p className="text-sm text-gray-600 text-center mb-4">Acceso rápido:</p>    return (        }; setLoading(true);

                    <div className="space-y-2">

                        <button        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">

                            onClick={() => handleQuickLogin('PIPO68', 'pipo123')}

                            disabled={loading}            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">        setError('');

                            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 text-sm"

                        >                <div className="text-center mb-8">

                            👨‍💼 PIPO68 (Admin)

                        </button>                    <img src="/favicon.ico" alt="StoryUp.es" className="w-16 h-16 mx-auto mb-4" />        return (

                        <button

                            onClick={() => handleQuickLogin('piporgz68', 'teacher123')}                    <h1 className="text-3xl font-bold text-gray-900 mb-2">StoryUp.es</h1>

                            disabled={loading}

                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 text-sm"                    <p className="text-gray-600">Red Social Educativa</p>            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">        try {

                        >

                            👨‍🏫 piporgz68 (Docente/Padre)                </div>

                        </button>

                    </div>                <Card className="w-full max-w-md">            const user = await loginUser(formData);

                </div>

                { error && (

                                <div className="mt-8 text-center">

                                    <p className="text-xs text-gray-500">                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">                    <CardHeader className="text-center">            setUser(user);

                                        © 2025 StoryUp.es - Red Social Educativa

                                    </p>                        {error}

                                    </div>

                                </div>                    </div > <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">            navigate('/dashboard'); // Redirigir al dashboard tras login exitoso

                                </div>

                        );                )
                    }

                };

                <LogIn className="w-8 h-8 text-white" />
            } catch (err: any) {

                export default LoginPage;
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">

                    <div>                    </div>            setError(err.message || 'Error al iniciar sesión');

                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">

                        Usuario o Email                        <CardTitle className="text-2xl font-bold text-blue-600">        } finally {

                        </label>

                    <input Iniciar Sesión en StoryUp setLoading(false);

                    type="text"

                    id="username"                        </CardTitle>
            }

            name = "username"

            value = { formData.username }                    </CardHeader >    };

        onChange = { handleChange }

        className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"                    <CardContent>

        placeholder = "PIPO68 o piporgz68"

        required < form onSubmit = { handleSubmit } className = "space-y-4" >    return (

                        />

                    </div >                            <div>        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">



                    <div>                                <Input            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">

                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">

                            Contraseña                                    type="email"                <div className="text-center mb-6">

                        </label>

                        <input                                        value={email}                    <h1 className="text-3xl font-bold text-blue-600">StoryUp</h1>

                            type="password"

                            id="password"                                        onChange={(e) => setEmail(e.target.value)}                    <p className="text-gray-600 mt-2">Iniciar Sesión</p>

                            name="password"

                            value={formData.password}                                        placeholder="Email"                </div>

                            onChange={handleChange}

                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"                                    required

                            placeholder="Ingresa tu contraseña"

                            required                            />                {error && (

                        />

                    </div>                        </div>                    <Alert variant="destructive" className="mb-4">



                    <button                                    <AlertDescription>{error}</AlertDescription>

type = "submit"

disabled = { loading }                                    <div>                    </Alert >

    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"

        > <Input                )}

            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}

                    </ button>                                type="password"

        </form>

value = { password } < form onSubmit = { handleSubmit } className = "space-y-4" >

    <div className="border-t pt-6">

        <p className="text-sm text-gray-600 text-center mb-4">Acceso rápido:</p>                                    onChange={(e) => setPassword(e.target.value)}                    <div>

            <div className="space-y-2">

                <button placeholder="Contraseña"                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">

                    onClick={() => handleQuickLogin('PIPO68', 'pipo123')}

                    disabled={loading}                                            required                            Email

                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 text-sm"

                        >                            />                        </label>

                👨‍💼 PIPO68 (Admin)

            </button>                                    </div>                        <Input

            <button

                            onClick={() => handleQuickLogin('piporgz68', 'teacher123')} id="email"

            disabled={loading}

            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 text-sm"                                        {error && (name = "email"

                >

                            👨‍🏫 piporgz68 (Docente/Padre)                                            < div className="text-red-600 text-sm text-center">                            type="email"

        </button>

    </div>                                        { error } value = { formData.email }

                </div >

                                    </div > onChange={ handleChange }

<div className="mt-8 text-center">

    <p className="text-xs text-gray-500">                        )}                            required

        © 2025 StoryUp.es - Red Social Educativa

    </p>                                    disabled={loading}

</div>

            </div > <Button placeholder="tu@email.com"

        </ div>

    );                                        type="submit" />

};

    className="w-full bg-blue-600 hover:bg-blue-700"                    </div>

export default LoginPage;
disabled = { loading } < div >

                        > <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">

        {loading ? 'Iniciando...' : 'Iniciar Sesión'}                            Contraseña

    </Button>                        </label >

                        </form > <Input

                </ CardContent>                            id="password"

</Card>                            name = "password"

            </div > type = "password"

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