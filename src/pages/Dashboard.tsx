import React from 'react'; import React from 'react'; import React from 'react'; import React from 'react'; import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuth } from '../App';

import { BookOpen, Users, Trophy, TrendingUp, MessageCircle, Star, Globe } from 'lucide-react'; import { Button } from '@/components/ui/button'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import Layout from '../components/Layout';

import { useAuth } from '../App';

export default function Dashboard() {

    const { user } = useAuth(); import { BookOpen, Users, Trophy, TrendingUp, MessageCircle, Star, Globe } from 'lucide-react'; import { Button } from '@/components/ui/button'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';



    return (import Layout from '../components/Layout';

        <Layout>

            <div className="space-y-8">import { useAuth } from '../App';

                <div className="text-center py-8">

                    <h1 className="text-4xl font-bold text-blue-600 mb-4">export default function Dashboard() {

                        ¡Bienvenido a StoryUp, {user?.name || user?.username}! 🎉

                    </h1>    const { user } = useAuth(); import { BookOpen, Users, Trophy, TrendingUp, MessageCircle, Star, Globe } from 'lucide-react'; import { Button } from '@/components/ui/button'; import { Button } from '@/components/ui/button';

                    <p className="text-xl text-gray-600 mb-2">

                        La red social educativa donde las historias cobran vida

                    </p>

                    <p className="text-lg text-gray-500">    return (import Layout from '../components/Layout';

                        Conecta, aprende y comparte con nuestra comunidad educativa

                    </p>        <Layout>

                </div>

            <div className="space-y-8">import { useAuth } from '../App';import { useAuth } from '../App';

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <Card className="hover:shadow-lg transition-shadow">                {/* Saludo de Bienvenida */}

                        <CardHeader className="text-center">

                            <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />                <div className="text-center py-8">export default function Dashboard() {

                            <CardTitle className="text-xl text-blue-600">Crea y Comparte Historias</CardTitle>

                        </CardHeader>                    <h1 className="text-4xl font-bold text-blue-600 mb-4">

                        <CardContent>

                            <p className="text-gray-600 text-center mb-4">                        ¡Bienvenido a StoryUp, {user?.name || user?.username}! 🎉    const { user } = useAuth();import { BookOpen, Users, Trophy, TrendingUp, MessageCircle, Star, Globe } from 'lucide-react';import { BookOpen, Users, Trophy, TrendingUp, MessageCircle, Star, Globe } from 'lucide-react';

                                Expresa tu creatividad escribiendo historias únicas.

                            </p>                    </h1>

                            <Button className="w-full bg-blue-600 hover:bg-blue-700">

                                Crear Historia                    <p className="text-xl text-gray-600 mb-2">

                            </Button>

                        </CardContent>                        La red social educativa donde las historias cobran vida

                    </Card>

                    </p>    return (import Layout from '../components/Layout';import Layout from '../components/Layout';

                    <Card className="hover:shadow-lg transition-shadow">

                        <CardHeader className="text-center">                    <p className="text-lg text-gray-500">

                            <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />

                            <CardTitle className="text-xl text-green-600">Conecta con la Comunidad</CardTitle>                        Conecta, aprende y comparte con nuestra comunidad educativa        <Layout>

                        </CardHeader>

                        <CardContent>                    </p>

                            <p className="text-gray-600 text-center mb-4">

                                Interactúa con estudiantes, profesores y padres.                </div>            <div className="space-y-8">

                            </p>

                            <Button className="w-full bg-green-600 hover:bg-green-700">

                                Ver Comunidad

                            </Button>                {/* Bloques de Presentación */}                {/* Saludo de Bienvenida */}

                        </CardContent>

                    </Card>                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">



                    <Card className="hover:shadow-lg transition-shadow">                    <Card className="hover:shadow-lg transition-shadow">                <div className="text-center py-8">export default function Dashboard() {export default function Dashboard() {

                        <CardHeader className="text-center">

                            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />                        <CardHeader className="text-center">

                            <CardTitle className="text-xl text-yellow-600">Concursos y Trofeos</CardTitle>

                        </CardHeader>                            <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />                    <h1 className="text-4xl font-bold text-blue-600 mb-4">

                        <CardContent>

                            <p className="text-gray-600 text-center mb-4">                            <CardTitle className="text-xl text-blue-600">Crea y Comparte Historias</CardTitle>

                                Participa en concursos de escritura y gana trofeos.

                            </p>                        </CardHeader>                        ¡Bienvenido a StoryUp, {user?.name || user?.username}! 🎉    const { user } = useAuth();    const { user } = useAuth();

                            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">

                                Ver Concursos                        <CardContent>

                            </Button>

                        </CardContent>                            <p className="text-gray-600 text-center mb-4">                    </h1>

                    </Card>

                                Expresa tu creatividad escribiendo historias únicas.

                    <Card className="hover:shadow-lg transition-shadow">

                        <CardHeader className="text-center">                            </p>                    <p className="text-xl text-gray-600 mb-2">

                            <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />

                            <CardTitle className="text-xl text-purple-600">Sigue tu Progreso</CardTitle>                            <Button className="w-full bg-blue-600 hover:bg-blue-700">

                        </CardHeader>

                        <CardContent>                                Crear Historia                        La red social educativa donde las historias cobran vida

                            <p className="text-gray-600 text-center mb-4">

                                Analiza tus estadísticas y crecimiento como escritor.                            </Button>

                            </p>

                            <Button className="w-full bg-purple-600 hover:bg-purple-700">                        </CardContent>                    </p>    return (    return (

                                Ver Estadísticas

                            </Button>                    </Card>

                        </CardContent>

                    </Card>                    <p className="text-lg text-gray-500">



                    <Card className="hover:shadow-lg transition-shadow">                    <Card className="hover:shadow-lg transition-shadow">

                        <CardHeader className="text-center">

                            <MessageCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />                        <CardHeader className="text-center">                        Conecta, aprende y comparte con nuestra comunidad educativa        <Layout>        <Layout>

                            <CardTitle className="text-xl text-red-600">Chat en Tiempo Real</CardTitle>

                        </CardHeader>                            <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />

                        <CardContent>

                            <p className="text-gray-600 text-center mb-4">                            <CardTitle className="text-xl text-green-600">Conecta con la Comunidad</CardTitle>                    </p>

                                Chatea con otros miembros de la comunidad.

                            </p>                        </CardHeader>

                            <Button className="w-full bg-red-600 hover:bg-red-700">

                                Abrir Chat                        <CardContent>                </div>            <div className="space-y-8">            <div className="space-y-8">

                            </Button>

                        </CardContent>                            <p className="text-gray-600 text-center mb-4">

                    </Card>

                                Interactúa con estudiantes, profesores y padres.

                    <Card className="hover:shadow-lg transition-shadow">

                        <CardHeader className="text-center">                            </p>

                            <Globe className="w-12 h-12 text-indigo-500 mx-auto mb-4" />

                            <CardTitle className="text-xl text-indigo-600">Noticias Educativas</CardTitle>                            <Button className="w-full bg-green-600 hover:bg-green-700">                {/* Bloques de Presentación */}                {/* Saludo de Bienvenida */}                {/* Saludo de Bienvenida */}

                        </CardHeader>

                        <CardContent>                                Ver Comunidad

                            <p className="text-gray-600 text-center mb-4">

                                Mantente informado con noticias educativas.                            </Button>                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            </p>

                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">                        </CardContent>

                                Leer Noticias

                            </Button>                    </Card>                    <Card className="hover:shadow-lg transition-shadow">                <div className="text-center py-8">                <div className="text-center py-8">

                        </CardContent>

                    </Card>

                </div>

                    <Card className="hover:shadow-lg transition-shadow">                        <CardHeader className="text-center">

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">

                    <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />                        <CardHeader className="text-center">

                    <h2 className="text-2xl font-bold text-gray-800 mb-4">

                        ¡Tu aventura educativa comienza aquí!                            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />                            <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />                    <h1 className="text-4xl font-bold text-blue-600 mb-4">                    <h1 className="text-4xl font-bold text-blue-600 mb-4">

                    </h2>

                    <p className="text-lg text-gray-600 mb-6">                            <CardTitle className="text-xl text-yellow-600">Concursos y Trofeos</CardTitle>

                        StoryUp es tu compañero en el viaje del aprendizaje.

                    </p>                        </CardHeader>                            <CardTitle className="text-xl text-blue-600">Crea y Comparte Historias</CardTitle>

                    <div className="flex justify-center space-x-4">

                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">                        <CardContent>

                            Crear Mi Primera Historia

                        </Button>                            <p className="text-gray-600 text-center mb-4">                        </CardHeader>                        ¡Bienvenido a StoryUp, {user?.name || user?.username}! 🎉                        ¡Bienvenido a StoryUp, {user?.name || user?.username}! 🎉

                        <Button size="lg" variant="outline">

                            Explorar la Comunidad                                Participa en concursos de escritura y gana trofeos.

                        </Button>

                    </div>                            </p>                        <CardContent>

                </div>

            </div>                            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">

        </Layout>

    );                                Ver Concursos                            <p className="text-gray-600 text-center mb-4">                    </h1>                    </h1>

}
                            </Button>

                        </CardContent>                                Expresa tu creatividad escribiendo historias únicas.

                    </Card>

                            </p>                    <p className="text-xl text-gray-600 mb-2">                    <p className="text-xl text-gray-600 mb-2">

                    <Card className="hover:shadow-lg transition-shadow">

                        <CardHeader className="text-center">                            <Button className="w-full bg-blue-600 hover:bg-blue-700">

                            <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />

                            <CardTitle className="text-xl text-purple-600">Sigue tu Progreso</CardTitle>                                Crear Historia                        La red social educativa donde las historias cobran vida                        La red social educativa donde las historias cobran vida

                        </CardHeader>

                        <CardContent>                            </Button>

                            <p className="text-gray-600 text-center mb-4">

                                Analiza tus estadísticas y crecimiento como escritor.                        </CardContent>                    </p>                    </p>

                            </p >

        <Button className="w-full bg-purple-600 hover:bg-purple-700">                    </Card>

                                Ver Estadísticas

                            </Button >                    <p className="text-lg text-gray-500">                    <p className="text-lg text-gray-500">

                        </CardContent>

                    </Card>                    <Card className="hover:shadow-lg transition-shadow">



                    <Card className="hover:shadow-lg transition-shadow">                        <CardHeader className="text-center">                        Conecta, aprende y comparte con nuestra comunidad educativa                        Conecta, aprende y comparte con nuestra comunidad educativa

                        <CardHeader className="text-center">

                            <MessageCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />                            <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />

                            <CardTitle className="text-xl text-red-600">Chat en Tiempo Real</CardTitle>

                        </CardHeader>                            <CardTitle className="text-xl text-green-600">Conecta con la Comunidad</CardTitle>                    </p>                    </p>

                        <CardContent>

                            <p className="text-gray-600 text-center mb-4">                        </CardHeader>

                                Chatea con otros miembros de la comunidad.

                            </p>                        <CardContent>                </div>                </div>

                            <Button className="w-full bg-red-600 hover:bg-red-700">

                                Abrir Chat                            <p className="text-gray-600 text-center mb-4">

                            </Button>

                        </CardContent > Interactúa con estudiantes, profesores y padres.

                    </Card >

                            </p >

        <Card className="hover:shadow-lg transition-shadow">

            <CardHeader className="text-center">                            <Button className="w-full bg-green-600 hover:bg-green-700">                {/* Bloques de Presentación de la Red Social */}                {/* Bloques de Presentación de la Red Social */}

                <Globe className="w-12 h-12 text-indigo-500 mx-auto mb-4" />

                <CardTitle className="text-xl text-indigo-600">Noticias Educativas</CardTitle>                                Ver Comunidad

            </CardHeader>

            <CardContent>                            </Button>                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <p className="text-gray-600 text-center mb-4">

                    Mantente informado con noticias educativas.                        </CardContent>

            </p>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">                    </Card>                    {/* Bloque 1: Historias */}                    {/* Bloque 1: Historias */}

                Leer Noticias

            </Button>

        </CardContent>

                    </Card > <Card className="hover:shadow-lg transition-shadow">                    <Card className="hover:shadow-lg transition-shadow">                    <Card className="hover:shadow-lg transition-shadow">

    </div>

        <CardHeader className="text-center">

            {/* Mensaje de Motivación */}

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">                            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />                        <CardHeader className="text-center">                        <CardHeader className="text-center">

                <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />

                <h2 className="text-2xl font-bold text-gray-800 mb-4">                            <CardTitle className="text-xl text-yellow-600">Concursos y Trofeos</CardTitle>

                    ¡Tu aventura educativa comienza aquí!

                </h2>                        </CardHeader>                            <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />                            <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />

                <p className="text-lg text-gray-600 mb-6">

                    StoryUp es tu compañero en el viaje del aprendizaje.                        <CardContent>

                </p>

                <div className="flex justify-center space-x-4">                            <p className="text-gray-600 text-center mb-4">                            <CardTitle className="text-xl text-blue-600">Crea y Comparte Historias</CardTitle>                            <CardTitle className="text-xl text-blue-600">Crea y Comparte Historias</CardTitle>

                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">

                        Crear Mi Primera Historia                                Participa en concursos de escritura y gana trofeos.

                    </Button>

                    <Button size="lg" variant="outline">                            </p>                        </CardHeader>                        </CardHeader>

        Explorar la Comunidad

    </Button>                            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">

        </div>

    </div>                                Ver Concursos < CardContent > <CardContent>

    </div>

        </Layout >                            </Button >

    );

}                        </CardContent > <p className="text-gray-600 text-center mb-4">                            <p className="text-gray-600 text-center mb-4">

</Card>

    Expresa tu creatividad escribiendo historias únicas. Comparte tus experiencias,                                 Expresa tu creatividad escribiendo historias únicas. Comparte tus experiencias,

    <Card className="hover:shadow-lg transition-shadow">

        <CardHeader className="text-center">                                aprendizajes y aventuras con la comunidad StoryUp.                                aprendizajes y aventuras con la comunidad StoryUp.

            <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />

            <CardTitle className="text-xl text-purple-600">Sigue tu Progreso</CardTitle>                            </p>                            </p>

                        </CardHeader >

    <CardContent>                            <Button className="w-full bg-blue-600 hover:bg-blue-700">                            <Button className="w-full bg-blue-600 hover:bg-blue-700">

        <p className="text-gray-600 text-center mb-4">

            Analiza tus estadísticas y crecimiento como escritor.                                Crear Historia                                Crear Historia

        </p>

        <Button className="w-full bg-purple-600 hover:bg-purple-700">                            </Button>                            </Button>

        Ver Estadísticas

    </Button>                        </CardContent>                        </CardContent >

                        </CardContent >

                    </Card >                    </Card >                    </Card >



    <Card className="hover:shadow-lg transition-shadow">

        <CardHeader className="text-center">

            <MessageCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />                    {/* Bloque 2: Comunidad */}                    {/* Bloque 2: Comunidad */}

            <CardTitle className="text-xl text-red-600">Chat en Tiempo Real</CardTitle>

        </CardHeader>                    <Card className="hover:shadow-lg transition-shadow">                    <Card className="hover:shadow-lg transition-shadow">

            <CardContent>

                <p className="text-gray-600 text-center mb-4">                        <CardHeader className="text-center">                        <CardHeader className="text-center">

                    Chatea con otros miembros de la comunidad.

                </p>                            <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />                            <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />

                    <Button className="w-full bg-red-600 hover:bg-red-700">

                        Abrir Chat                            <CardTitle className="text-xl text-green-600">Conecta con la Comunidad</CardTitle>                            <CardTitle className="text-xl text-green-600">Conecta con la Comunidad</CardTitle>

                    </Button>

                </CardContent>                        </CardHeader>                        </CardHeader>

        </Card>

            <CardContent>                        <CardContent>

                <Card className="hover:shadow-lg transition-shadow">

                    <CardHeader className="text-center">                            <p className="text-gray-600 text-center mb-4">                            <p className="text-gray-600 text-center mb-4">

                        <Globe className="w-12 h-12 text-indigo-500 mx-auto mb-4" />

                        <CardTitle className="text-xl text-indigo-600">Noticias Educativas</CardTitle>                                Interactúa con estudiantes, profesores y padres. Haz nuevos amigos y                                 Interactúa con estudiantes, profesores y padres. Haz nuevos amigos y

                    </CardHeader>

                        <CardContent>                                construye una red de aprendizaje colaborativo.                                construye una red de aprendizaje colaborativo.

                            <p className="text-gray-600 text-center mb-4">

                                Mantente informado con noticias educativas.                            </p>                            </p>

                    </p>

                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">                            <Button className="w-full bg-green-600 hover:bg-green-700">                            <Button className="w-full bg-green-600 hover:bg-green-700">

                        Leer Noticias

                    </Button>                                Ver Comunidad                                Ver Comunidad

                    </CardContent>

                </Card>                            </Button>                            </Button>

        </div>

    </CardContent>                        </CardContent >

        {/* Mensaje de Motivación */ }

        < div className = "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center" >                    </Card >                    </Card >

                    <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />

                    <h2 className="text-2xl font-bold text-gray-800 mb-4">

                        ¡Tu aventura educativa comienza aquí!

                    </h2>                    {/* Bloque 3: Concursos y Trofeos */ } {/* Bloque 3: Concursos y Trofeos */ }

<p className="text-lg text-gray-600 mb-6">

    StoryUp es tu compañero en el viaje del aprendizaje.                    <Card className="hover:shadow-lg transition-shadow">                    <Card className="hover:shadow-lg transition-shadow">

    </p>

        <div className="flex justify-center space-x-4">                        <CardHeader className="text-center">                        <CardHeader className="text-center">

            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">

                Crear Mi Primera Historia                            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />                            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />

            </Button>

            <Button size="lg" variant="outline">                            <CardTitle className="text-xl text-yellow-600">Concursos y Trofeos</CardTitle>                            <CardTitle className="text-xl text-yellow-600">Concursos y Trofeos</CardTitle>

                Explorar la Comunidad

            </Button>                        </CardHeader>                        </CardHeader>

        </div>

    </div>                        <CardContent>                        <CardContent>

    </div>

    </Layout>                            <p className="text-gray-600 text-center mb-4">                            <p className="text-gray-600 text-center mb-4">

        );

}                                Participa en emocionantes concursos de escritura y gana trofeos.                                 Participa en emocionantes concursos de escritura y gana trofeos.

        Demuestra tu talento y obtén reconocimiento por tu creatividad.                                Demuestra tu talento y obtén reconocimiento por tu creatividad.

    </p>                            </p>

    <Button className="w-full bg-yellow-600 hover:bg-yellow-700">                            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">

        Ver Concursos                                Ver Concursos

    </Button>                            </Button>

</CardContent>                        </CardContent >

                    </Card >                    </Card >



    {/* Bloque 4: Estadísticas */ }                    {/* Bloque 4: Estadísticas */ }

<Card className="hover:shadow-lg transition-shadow">                    <Card className="hover:shadow-lg transition-shadow">

    <CardHeader className="text-center">                        <CardHeader className="text-center">

        <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />                            <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />

        <CardTitle className="text-xl text-purple-600">Sigue tu Progreso</CardTitle>                            <CardTitle className="text-xl text-purple-600">Sigue tu Progreso</CardTitle>

    </CardHeader>                        </CardHeader>

    <CardContent>                        <CardContent>

        <p className="text-gray-600 text-center mb-4">                            <p className="text-gray-600 text-center mb-4">

            Analiza tus estadísticas, ve tu crecimiento como escritor y                                 Analiza tus estadísticas, ve tu crecimiento como escritor y

            descubre las tendencias más populares en la comunidad.                                descubre las tendencias más populares en la comunidad.

        </p>                            </p>

        <Button className="w-full bg-purple-600 hover:bg-purple-700">                            <Button className="w-full bg-purple-600 hover:bg-purple-700">

            Ver Estadísticas                                Ver Estadísticas

        </Button>                            </Button>

    </CardContent>                        </CardContent>

</Card>                    </Card>



{/* Bloque 5: Chat y Comunicación */ } {/* Bloque 5: Chat y Comunicación */ }

<Card className="hover:shadow-lg transition-shadow">                    <Card className="hover:shadow-lg transition-shadow">

    <CardHeader className="text-center">                        <CardHeader className="text-center">

        <MessageCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />                            <MessageCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />

        <CardTitle className="text-xl text-red-600">Chat en Tiempo Real</CardTitle>                            <CardTitle className="text-xl text-red-600">Chat en Tiempo Real</CardTitle>

    </CardHeader>                        </CardHeader>

    <CardContent>                        <CardContent>

        <p className="text-gray-600 text-center mb-4">                            <p className="text-gray-600 text-center mb-4">

            Chatea con otros miembros de la comunidad. Intercambia ideas,                                 Chatea con otros miembros de la comunidad. Intercambia ideas,

            colabora en proyectos y mantente conectado.                                colabora en proyectos y mantente conectado.

        </p>                            </p>

        <Button className="w-full bg-red-600 hover:bg-red-700">                            <Button className="w-full bg-red-600 hover:bg-red-700">

            Abrir Chat                                Abrir Chat

        </Button>                            </Button>

    </CardContent>                        </CardContent>

</Card>                    </Card>



{/* Bloque 6: Noticias Educativas */ } {/* Bloque 6: Noticias Educativas */ }

<Card className="hover:shadow-lg transition-shadow">                    <Card className="hover:shadow-lg transition-shadow">

    <CardHeader className="text-center">                        <CardHeader className="text-center">

        <Globe className="w-12 h-12 text-indigo-500 mx-auto mb-4" />                            <Globe className="w-12 h-12 text-indigo-500 mx-auto mb-4" />

        <CardTitle className="text-xl text-indigo-600">Noticias Educativas</CardTitle>                            <CardTitle className="text-xl text-indigo-600">Noticias Educativas</CardTitle>

    </CardHeader>                        </CardHeader>

    <CardContent>                        <CardContent>

        <p className="text-gray-600 text-center mb-4">                            <p className="text-gray-600 text-center mb-4">

            Mantente informado con las últimas noticias educativas creadas por                                 Mantente informado con las últimas noticias educativas creadas por

            nuestros docentes y expertos en educación.                                nuestros docentes y expertos en educación.

        </p>                            </p>

        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">

            Leer Noticias                                Leer Noticias

        </Button>                            </Button>

    </CardContent>                        </CardContent>

</Card>                    </Card>

                </div >                </div >



    {/* Mensaje de Motivación */ }                {/* Mensaje de Motivación */ }

<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">

    <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />                    <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />

    <h2 className="text-2xl font-bold text-gray-800 mb-4">                    <h2 className="text-2xl font-bold text-gray-800 mb-4">

        ¡Tu aventura educativa comienza aquí!                        ¡Tu aventura educativa comienza aquí!

    </h2>                    </h2>

    <p className="text-lg text-gray-600 mb-6">                    <p className="text-lg text-gray-600 mb-6">

        StoryUp es más que una red social: es tu compañero en el viaje del aprendizaje.                         StoryUp es más que una red social: es tu compañero en el viaje del aprendizaje.

        Cada historia que compartes, cada conexión que haces, cada trofeo que ganas                         Cada historia que compartes, cada conexión que haces, cada trofeo que ganas

        es un paso hacia un futuro más brillante.                        es un paso hacia un futuro más brillante.

    </p>                    </p>

    <div className="flex justify-center space-x-4">                    <div className="flex justify-center space-x-4">

        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">

            Crear Mi Primera Historia                            Crear Mi Primera Historia

        </Button>                        </Button>

        <Button size="lg" variant="outline">                        <Button size="lg" variant="outline">

            Explorar la Comunidad                            Explorar la Comunidad

        </Button>                        </Button>

    </div>                    </div>

</div>                </div>

            </div >            </div >

        </Layout >        </Layout >

    );    );

}}
image: null
        }
    ];

const filteredStories = stories.filter(story => {
    const matchesSearch = story.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    return matchesSearch && matchesCategory;
});

return (
    <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold">Historias de la Comunidad</h1>
            </div>

            {/* Filtros y búsqueda */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Buscador */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar historias o usuarios..."
                                className="pl-10"
                            />
                        </div>

                        {/* Filtro por categoría */}
                        <div className="flex gap-2 flex-wrap">
                            {categories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category.id)}
                                >
                                    {category.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de historias */}
            <div className="space-y-4">
                {filteredStories.length > 0 ? (
                    filteredStories.map((story) => (
                        <Card key={story.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                {/* Header de la historia */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={story.user.avatar}
                                            alt={story.user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="font-semibold">{story.user.name}</h3>
                                            <p className="text-sm text-gray-500">@{story.user.username} • {story.timestamp}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">
                                        {categories.find(c => c.id === story.category)?.label}
                                    </Badge>
                                </div>

                                {/* Contenido */}
                                <div className="mb-4">
                                    <p className="text-gray-700 leading-relaxed">{story.content}</p>
                                    {story.image && (
                                        <img
                                            src={story.image}
                                            alt="Historia"
                                            className="w-full h-64 object-cover rounded-lg mt-3"
                                        />
                                    )}
                                </div>

                                {/* Acciones */}
                                <div className="flex items-center gap-6 pt-4 border-t">
                                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                        <Heart className="h-4 w-4" />
                                        <span>{story.likes}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4" />
                                        <span>{story.comments}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                        <Share className="h-4 w-4" />
                                        <span>Compartir</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                No se encontraron historias
                            </h3>
                            <p className="text-gray-500">
                                Intenta cambiar los filtros o términos de búsqueda
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    </Layout>
);
}