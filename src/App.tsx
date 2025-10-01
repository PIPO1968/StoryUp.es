import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import ProfilePage from './pages/ProfilePage'

// Configuración de Supabase
const supabaseUrl = 'https://kvvsbomvoxvvunxkkjyf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dnNib212b3h2dnVueGtranlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzI4NjIsImV4cCI6MjA3NDY0ODg2Mn0.DSriZyytXiCDbutr6XJyV-0DAQh87G5EEVUOR2IvZ8k'
const supabase = createClient(supabaseUrl, supabaseKey)

// Simple User Context
interface User {
    id: string
    email: string
    name: string
    username: string
    userType: 'usuario' | 'padre-docente'
    avatar?: string
    bio?: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, username: string, userType: 'usuario' | 'padre-docente') => Promise<void>
    signOut: () => void
    updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Verificar sesión existente en Supabase y forzar inserción si no existe
        const checkSession = async () => {
            console.log('🔍 Verificando sesión en Supabase...')
            try {
                const { data: { session }, error } = await supabase.auth.getSession()
                if (error) {
                    console.error('Error obteniendo sesión:', error)
                    setLoading(false)
                    return
                }
                if (session?.user) {
                    console.log('✅ Sesión encontrada en Supabase:', session.user.email)
                    // Buscar usuario por id de sesión en la tabla users
                    let { data: userById, error: userIdError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();
                    if (userIdError && userIdError.code !== 'PGRST116') {
                        console.error('Error consultando usuario por id:', userIdError);
                        setUser(null);
                        setLoading(false);
                        return;
                    }
                    if (!userById) {
                        console.log('Usuario no encontrado en tabla users, creando...');
                        // Crear usuario en tabla si no existe
                        const nickname = session.user.user_metadata?.username || session.user.email!.split('@')[0];
                        const userType = session.user.user_metadata?.user_type === 'padre-docente' ? 'padre-docente' : 'usuario';
                        const newUser = {
                            id: session.user.id,
                            email: session.user.email!,
                            name: nickname,
                            username: nickname,
                            user_type: userType
                        };
                        let createdUser = null;
                        let createError = null;
                        for (let i = 0; i < 3; i++) {
                            const { data, error } = await supabase
                                .from('users')
                                .insert([newUser])
                                .select()
                                .single();
                            console.log(`Intento ${i+1} de inserción en users:`, { data, error });
                            if (data) {
                                createdUser = data;
                                break;
                            }
                            if (error) {
                                createError = error;
                                await new Promise(res => setTimeout(res, 500));
                            }
                        }
                        if (createdUser) {
                            console.log('✅ Usuario creado exitosamente:', createdUser.username);
                            setUser({
                                id: createdUser.id,
                                email: createdUser.email,
                                name: createdUser.name,
                                username: createdUser.username,
                                userType: createdUser.user_type === 'padre-docente' ? 'padre-docente' : 'usuario',
                                avatar: createdUser.avatar,
                                bio: createdUser.bio
                            });
                        } else {
                            console.error('❌ Error creando usuario en tabla users:', createError);
                        }
                    } else {
                        console.log('✅ Usuario encontrado en BD:', userById.username);
                        setUser(userById);
                    }
                } else {
                    console.log('ℹ️ No hay sesión activa')
                }
            } catch (error) {
                console.error('❌ Error verificando sesión:', error)
            }
            setLoading(false)
        }
        checkSession()

        // Escuchar cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔄 Cambio de auth:', event, session?.user?.email)

            if (event === 'SIGNED_IN' && session?.user) {
                console.log('✅ Usuario logueado, buscando datos en BD...')

                try {
                    // Buscar datos completos del usuario en la tabla users con TIMEOUT
                    console.log('🔍 Consultando tabla users para:', session.user.email)

                    // Crear promesa con timeout de 5 segundos
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('Timeout de consulta BD')), 5000)
                    })

                    const queryPromise = supabase
                        .from('users')
                        .select('*')
                        .eq('email', session.user.email)
                        .single()

                    try {
                        const result = await Promise.race([queryPromise, timeoutPromise]) as any
                        const userData = result?.data
                        const userError = result?.error

                        console.log('📊 Resultado consulta users:', { userData, userError })

                        if (userError || !userData) {
                            console.log('❌ Usuario no encontrado, usando datos de sesión...')
                            // Crear usuario con datos de la sesión de Supabase Auth
                            const nickname = session.user.user_metadata?.username || '';
                            const userType: 'usuario' | 'padre-docente' = session.user.user_metadata?.user_type === 'padre-docente' ? 'padre-docente' : 'usuario';
                            const sessionUser: User = {
                                id: session.user.id,
                                email: session.user.email!,
                                name: nickname,
                                username: nickname,
                                userType,
                                avatar: undefined,
                                bio: 'Usuario de StoryUp'
                            };
                            console.log('✅ Usuario creado desde sesión:', sessionUser.username);
                            setUser(sessionUser);
                        } else {
                            console.log('✅ Usuario encontrado en BD:', userData.username)
                            // Mapear campos de BD a interfaz TypeScript
                            const mappedUser = {
                                id: userData.id,
                                email: userData.email,
                                name: userData.name,
                                username: userData.username,
                                userType: (userData.user_type === 'usuario' ? 'usuario' : userData.user_type === 'padre-docente' ? 'padre-docente' : 'usuario') as 'usuario' | 'padre-docente',
                                avatar: userData.avatar,
                                bio: userData.bio
                            }
                            setUser(mappedUser)
                        }
                    } catch (timeoutError) {
                        console.warn('⚠️ Timeout en consulta BD, usando datos de sesión:', timeoutError.message)
                        // Fallback: usar datos de la sesión si hay timeout
                        const nickname = session.user.user_metadata?.username || '';
                        const userType: 'usuario' | 'padre-docente' = session.user.user_metadata?.user_type === 'padre-docente' ? 'padre-docente' : 'usuario';
                        const sessionUser: User = {
                            id: session.user.id,
                            email: session.user.email!,
                            name: nickname,
                            username: nickname,
                            userType,
                            avatar: undefined,
                            bio: 'Usuario de StoryUp'
                        };
                        console.log('✅ Usuario fallback creado:', sessionUser.username);
                        setUser(sessionUser);
                    }
                } catch (error) {
                    console.error('❌ Error en proceso de autenticación:', error)
                    // Fallback temporal en caso de error grave
                    const nickname = session.user.user_metadata?.username || '';
                    const userType: 'usuario' | 'padre-docente' = session.user.user_metadata?.user_type === 'padre-docente' ? 'padre-docente' : 'usuario';
                    const tempUser: User = {
                        id: session.user.id,
                        email: session.user.email!,
                        name: nickname,
                        username: nickname,
                        userType,
                        avatar: undefined,
                        bio: undefined
                    };
                    setUser(tempUser);
                }
            } if (event === 'SIGNED_OUT') {
                console.log('👋 Usuario deslogueado')
                setUser(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async (email: string, password: string) => {
        console.log('🔐 Iniciando login con Supabase Auth...')

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.toLowerCase(),
                password: password
            })

            if (error) {
                console.error('Error en login:', error.message)
                throw new Error(error.message)
            }

            if (data.user) {
                console.log('✅ Login exitoso:', data.user.email)
                // El usuario se actualizará automáticamente por el listener de auth
            }
        } catch (error) {
            console.error('Error en signIn:', error)
            throw error
        }
    }

    const signUp = async (email: string, password: string, username: string, userType: 'usuario' | 'padre-docente') => {
        console.log('🔐 Creando cuenta con Supabase Auth...')

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.toLowerCase(),
                password: password,
                options: {
                    data: {
                        username: username,
                        user_type: userType
                    },
                    emailRedirectTo: undefined // Deshabilitar confirmación de email para desarrollo
                }
            })

            // Forzar el guardado correcto de nickname y tipo en los metadatos de Supabase Auth
            if (data.user) {
                await supabase.auth.updateUser({
                    data: {
                        username: username,
                        user_type: userType
                    }
                });
            }

            if (error) {
                console.error('Error en registro:', error.message)
                throw new Error(error.message)
            }

            if (data.user) {
                console.log('✅ Registro exitoso:', data.user.email)

                // Verificar si ya existe un usuario con ese email en la tabla users
                const { data: existingUsers, error: selectError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', data.user.email)

                if (selectError) {
                    console.error('Error consultando usuarios existentes:', selectError)
                }

                if (!existingUsers || existingUsers.length === 0) {
                    // Crear entrada en tabla users solo si no existe
                    const newUser = {
                        id: data.user.id,
                        email: data.user.email!,
                        name: username,
                        username: username,
                        user_type: userType
                    }

                    const { error: insertError } = await supabase
                        .from('users')
                        .insert([newUser])

                    if (insertError) {
                        console.error('Error creando usuario en tabla:', insertError)
                    }
                } else {
                    console.log('El usuario ya existe en la tabla users, no se inserta duplicado.')
                }
            }
        } catch (error) {
            console.error('Error en signUp:', error)
            throw error
        }
    }

    const signOut = async () => {
        console.log('🚪 Cerrando sesión...')

        try {
            const { error } = await supabase.auth.signOut()

            if (error) {
                console.error('Error cerrando sesión:', error)
            } else {
                console.log('✅ Sesión cerrada')
                setUser(null)
            }
        } catch (error) {
            console.error('Error en signOut:', error)
        }
    }

    const updateProfile = async (updates: Partial<User>) => {
        if (!user) return

        console.log('📝 Actualizando perfil en Supabase...')

        try {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single()

            if (error) {
                console.error('Error actualizando perfil:', error)
                throw error
            }

            if (data) {
                setUser(data)
                console.log('✅ Perfil actualizado')
            }
        } catch (error) {
            console.error('Error en updateProfile:', error)
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}

// Login/Register Page
function LoginPage() {
    const { signIn, signUp, user } = useAuth()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [isRegister, setIsRegister] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true })
        }
    }, [user, navigate])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const username = formData.get('username') as string
        const userType = formData.get('userType') as 'usuario' | 'padre-docente'

        try {
            if (isRegister) {
                if (!username?.trim()) {
                    throw new Error('El nickname es obligatorio')
                }
                if (!userType) {
                    throw new Error('Debes seleccionar el tipo de usuario')
                }
                await signUp(email, password, username.trim(), userType)
                setSuccess(`¡Registro exitoso! Bienvenido ${username}`)
                setTimeout(() => navigate('/', { replace: true }), 1500)
            } else {
                await signIn(email, password)
                setSuccess('¡Login exitoso!')
                setTimeout(() => navigate('/', { replace: true }), 1500)
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
            setError(errorMsg)
        }

        setIsLoading(false)
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                        marginBottom: '0.5rem'
                    }}>
                        StoryUp
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                        La red social para conectar y compartir
                    </p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        border: '2px solid #fca5a5',
                        color: '#dc2626',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontWeight: '500'
                    }}>
                        ❌ {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        backgroundColor: '#d1fae5',
                        border: '2px solid #6ee7b7',
                        color: '#059669',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontWeight: '500'
                    }}>
                        ✅ {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    👤 Nickname *
                                </label>
                                <input
                                    name="username"
                                    type="text"
                                    required={isRegister}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem',
                                        border: '2px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                    placeholder="Tu nickname"
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    👥 Tipo de Usuario *
                                </label>
                                <select
                                    name="userType"
                                    required={isRegister}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem',
                                        border: '2px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <option value="">Selecciona tu tipo de usuario</option>
                                    <option value="usuario">🧑‍🎓 Usuario</option>
                                    <option value="padre-docente">👨‍🏫 Padre/Docente</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#374151'
                        }}>
                            📧 Email *
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                border: '2px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#374151'
                        }}>
                            🔒 Contraseña *
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                border: '2px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            placeholder="Tu contraseña"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            marginBottom: '1rem'
                        }}
                    >
                        {isLoading ? (
                            <span>⏳ {isRegister ? 'Registrando...' : 'Iniciando...'}</span>
                        ) : (
                            <span>{isRegister ? '📝 Crear Cuenta' : '🔑 Iniciar Sesión'}</span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setIsRegister(!isRegister)
                            setError(null)
                            setSuccess(null)
                        }}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            backgroundColor: 'transparent',
                            color: '#3b82f6',
                            border: '2px solid #3b82f6',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        {isRegister ? '🔑 ¿Ya tienes cuenta? Iniciar sesión' : '📝 ¿Sin cuenta? Regístrate'}
                    </button>
                </form>
            </div>
        </div>
    )
}

// Home Page - Versión Original Limpia
function HomePage() {
    const { user, signOut, updateProfile } = useAuth()
    const [currentTime, setCurrentTime] = useState(new Date())
    const [currentLanguage, setCurrentLanguage] = useState('es')
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

    // Estado para la página actual (sin localStorage)
    const [currentPage, setCurrentPage] = useState(() => {
        // Recuperar la última página visitada
        try {
            const savedPage = sessionStorage.getItem('storyup_current_page')
            return savedPage || 'inicio'
        } catch {
            return 'inicio'
        }
    })

    const [totalUsers, setTotalUsers] = useState(0)

    // Estados para el formulario de creación de historias
    const [storyForm, setStoryForm] = useState({
        title: '',
        content: '',
        type: '', // 'real' o 'ficcion'
        genre: '' // 'fantasia', 'aventura', etc.
    })
    const [showValidationError, setShowValidationError] = useState(false)
    const [isSubmittingStory, setIsSubmittingStory] = useState(false)
    const [stories, setStories] = useState<any[]>(() => {
        // Intentar recuperar historias del sessionStorage como respaldo para HMR
        try {
            const savedStories = sessionStorage.getItem('storyup_stories_cache')
            return savedStories ? JSON.parse(savedStories) : []
        } catch (error) {
            console.warn('Error recuperando cache de historias:', error)
            return []
        }
    })

    // Función para actualizar historias y cache
    const updateStoriesWithCache = (updater: (prev: any[]) => any[]) => {
        setStories(prevStories => {
            const newStories = updater(prevStories)
            // Guardar en sessionStorage como respaldo para HMR
            try {
                sessionStorage.setItem('storyup_stories_cache', JSON.stringify(newStories))
            } catch (error) {
                console.warn('Error guardando cache de historias:', error)
            }
            return newStories
        })
    }

    // Función para limpiar cache si es necesario
    const clearStoriesCache = () => {
        try {
            sessionStorage.removeItem('storyup_stories_cache')
            console.log('🧹 Cache de historias limpiado')
        } catch (error) {
            console.warn('Error limpiando cache:', error)
        }
    }

    // Cargar historias desde Supabase
    useEffect(() => {
        const loadStories = async () => {
            console.log('📚 Cargando historias desde Supabase...')

            try {
                const { data, error } = await supabase
                    .from('stories')
                    .select(`
                        *,
                        author:users!stories_author_id_fkey(username, name)
                    `)
                    .order('created_at', { ascending: false })

                if (error) {
                    console.error('Error cargando historias:', error)
                } else {
                    // Procesar los datos para obtener el autor correcto
                    const processedStories = data?.map(story => ({
                        ...story,
                        likes_count: 0, // Por ahora 0, luego implementaremos likes
                        comments_count: 0, // Por ahora 0, luego implementaremos comentarios
                        author_name: story.author?.username || story.author?.name || 'Usuario desconocido'
                    })) || []

                    console.log('✅ Historias cargadas desde Supabase:', processedStories.length)
                    // Limpiar cache anterior y actualizar con datos frescos de BD
                    clearStoriesCache()
                    updateStoriesWithCache(() => processedStories)
                }
            } catch (error) {
                console.error('Error en loadStories:', error)
                // Cargar sin joins si falla
                try {
                    console.log('🔄 Intentando carga simple...')
                    const { data: simpleData, error: simpleError } = await supabase
                        .from('stories')
                        .select('*')
                        .order('created_at', { ascending: false })

                    if (simpleError) {
                        console.error('Error en carga simple:', simpleError)
                    } else {
                        console.log('✅ Historias cargadas (modo simple):', simpleData.length)
                        updateStoriesWithCache(() => simpleData || [])
                    }
                } catch (fallbackError) {
                    console.error('Error en fallback:', fallbackError)
                }
            }
        }

        loadStories()
    }, [])

    // Estados para el chat
    const [chatSearchTerm, setChatSearchTerm] = useState('')
    const [activeUsers, setActiveUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [messageText, setMessageText] = useState('')
    const [messages, setMessages] = useState<Array<{
        id: string
        from: string
        to: string
        text: string
        timestamp: string
    }>>([])
    const [chatMessages, setChatMessages] = useState<Array<{
        id: string
        from: string
        to: string
        text: string
        timestamp: string
    }>>([])

    // Función para guardar historias directamente en Supabase
    const saveStory = async (storyData: any) => {
        console.log('📝 Guardando historia en Supabase...', storyData)

        if (!user) {
            throw new Error('Usuario no autenticado')
        }

        try {
            // Preparar datos para Supabase
            const storyToSave = {
                title: storyData.title,
                content: storyData.content,
                type: storyData.type,
                genre: storyData.genre,
                author_id: user.id,
                created_at: new Date().toISOString()
            }

            // Guardar en Supabase
            const { data, error } = await supabase
                .from('stories')
                .insert([storyToSave])
                .select(`
                    *,
                    author:users!stories_author_id_fkey(username, name)
                `)
                .single()

            if (error) {
                console.error('❌ Error guardando en Supabase:', error)
                throw error
            }

            // Procesar la historia guardada
            const savedStory = {
                ...data,
                likes_count: 0,
                comments_count: 0,
                author_name: data.author?.username || data.author?.name || user.username
            }

            // Actualizar estado local
            updateStoriesWithCache(prevStories => [savedStory, ...prevStories])
            console.log('✅ Historia guardada exitosamente en Supabase:', savedStory.title)

            return savedStory

        } catch (error) {
            console.error('❌ Error en saveStory:', error)
            throw error
        }
    }

    // Estado para usuarios reales de Supabase
    const [allUsers, setAllUsers] = useState<User[]>([])

    // Cargar usuarios reales desde Supabase
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                console.log('Respuesta completa de Supabase:', { data, error });
                if (!error) {
                    if (Array.isArray(data)) {
                        data.forEach((u, i) => {
                            console.log(`Usuario[${i}]:`, u);
                        });
                        setAllUsers(data);
                        console.log('Conteo de usuarios:', data.length);
                    } else {
                        setAllUsers([]);
                        console.log('No se obtuvo un array de usuarios.');
                    }
                } else {
                    console.error('Error obteniendo usuarios:', error);
                    setAllUsers([]);
                }
            } catch (error) {
                console.error('Error en loadUsers:', error);
                setAllUsers([]);
            }
        }
        loadUsers()
    }, [])

    const getOtherUsers = () => {
        if (!user) return []

        // Mostrar solo otros usuarios (no a sí mismo)
        return allUsers.filter((u: User) => u.id !== user.id)
    }

    const getFilteredUsers = () => {
        const otherUsers = getOtherUsers()
        if (!chatSearchTerm.trim()) return otherUsers

        return otherUsers.filter((user: User) =>
            (user.username || user.name || '').toLowerCase().includes(chatSearchTerm.toLowerCase())
        )
    }

    const addToActiveUsers = () => {
        const filteredUsers = getFilteredUsers()
        if (filteredUsers.length === 0) return

        const userToAdd = filteredUsers[0] // Tomar el primero de los filtrados
        if (!activeUsers.find(u => u.id === userToAdd.id)) {
            setActiveUsers([...activeUsers, userToAdd])
            setChatSearchTerm('') // Limpiar búsqueda
        }
    }

    const removeFromActiveUsers = () => {
        const filteredUsers = getFilteredUsers()
        if (filteredUsers.length === 0) return

        const userToRemove = filteredUsers[0]
        setActiveUsers(activeUsers.filter(u => u.id !== userToRemove.id))
        setChatSearchTerm('') // Limpiar búsqueda
    }

    // Función para enviar mensajes
    // Función para enviar mensajes usando SOLO Supabase
    const sendMessage = async () => {
        if (!messageText.trim() || !selectedUser || !user) return

        console.log('📤 Enviando mensaje a Supabase...', { from: user.username, to: selectedUser.username })

        const newMessage = {
            sender_id: user.id,
            receiver_id: selectedUser.id,
            content: messageText.trim()
        }

        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .insert([newMessage])
                .select()

            if (error) {
                console.error('❌ Error enviando mensaje:', error)
                alert(`Error al enviar mensaje: ${error.message}`)
                return
            }

            console.log('✅ Mensaje enviado exitosamente a Supabase:', data)

            // Limpiar input
            setMessageText('')

            // Recargar mensajes
            loadMessages()

        } catch (error) {
            console.error('💥 Error de conexión:', error)
            alert('Error de conexión. Verifica tu conexión a internet y las credenciales de Supabase.')
        }
    }    // Función para cargar mensajes desde SOLO Supabase
    const loadMessages = async () => {
        console.log('🔍 Cargando mensajes desde Supabase...')
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select(`
                    *,
                    sender:users!sender_id(username),
                    receiver:users!receiver_id(username)
                `)
                .order('created_at', { ascending: true })

            if (error) {
                console.error('❌ Error cargando mensajes desde Supabase:', error)
                alert(`Error cargando mensajes: ${error.message}`)
                setMessages([])
                return
            }

            console.log('✅ Mensajes cargados desde Supabase:', data)

            // Convertir formato de Supabase al formato esperado por la UI
            const formattedMessages = data.map(msg => ({
                id: msg.id.toString(),
                from: msg.sender?.username || 'Usuario desconocido',
                to: msg.receiver?.username || 'Usuario desconocido',
                text: msg.content,
                timestamp: new Date(msg.created_at).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }))

            setMessages(formattedMessages)
            console.log(`📨 Se cargaron ${formattedMessages.length} mensajes desde Supabase`)

        } catch (error) {
            console.error('💥 Error de conexión cargando mensajes:', error)
            alert('Error de conexión. Verifica tu conexión a internet y las credenciales de Supabase.')
            setMessages([])
        }
    }    // Función para inicializar tabla messages si no existe
    const initializeMessagesTable = async () => {
        console.log('Nota: La tabla messages debe crearse manualmente en Supabase con el SQL proporcionado')
    }    // Función para manejar Enter en el input del mensaje
    const handleMessageKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const [selectedStory, setSelectedStory] = useState(null)
    const [showComments, setShowComments] = useState<string | null>(null) // ID de la historia con comentarios visibles
    const [newComment, setNewComment] = useState('')

    // Ref para el textarea del editor
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Funciones para formato de texto
    const insertTextAtCursor = (beforeText: string, afterText: string = '') => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = storyForm.content.substring(start, end)

        const newText = beforeText + selectedText + afterText
        const newContent = storyForm.content.substring(0, start) + newText + storyForm.content.substring(end)

        handleStoryFormChange('content', newContent)

        // Restaurar el foco y posición del cursor
        setTimeout(() => {
            textarea.focus()
            const newCursorPos = start + beforeText.length + selectedText.length + afterText.length
            textarea.setSelectionRange(newCursorPos, newCursorPos)
        }, 0)
    }

    const formatBold = () => {
        insertTextAtCursor('**', '**')
    }

    const formatUnderline = () => {
        insertTextAtCursor('<u>', '</u>')
    }

    const insertSubtitle = (level: string) => {
        const subtitleText = level === 'Subtítulo 1' ? '## ' :
            level === 'Subtítulo 2' ? '### ' :
                level === 'Subtítulo 3' ? '#### ' : ''
        insertTextAtCursor('\n' + subtitleText, '\n')
    }

    const handleImageUpload = () => {
        const input = document.getElementById('imageUpload') as HTMLInputElement
        input?.click()
    }

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Crear URL temporal para mostrar la imagen
            const reader = new FileReader()
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string
                const imageMarkdown = `\n![${file.name}](${imageUrl})\n`
                insertTextAtCursor(imageMarkdown, '')
            }
            reader.readAsDataURL(file)
        }
        // Limpiar el input para permitir seleccionar la misma imagen otra vez
        event.target.value = ''
    }

    // Función para renderizar contenido con imágenes y formato
    const renderContentWithFormat = (content: string, isPreview: boolean = false) => {
        if (!content) return null

        // Función simple para procesar texto con formato
        const processText = (text: string) => {
            // Dividir en párrafos primero
            const paragraphs = text.split('\n\n')

            return paragraphs.map((paragraph, pIndex) => {
                const lines = paragraph.split('\n')

                return (
                    <div key={`para-${pIndex}`} style={{ marginBottom: pIndex < paragraphs.length - 1 ? '1rem' : '0' }}>
                        {lines.map((line, lIndex) => (
                            <div key={`line-${pIndex}-${lIndex}`}>
                                {processFormats(line)}
                                {lIndex < lines.length - 1 && <br />}
                            </div>
                        ))}
                    </div>
                )
            })
        }

        // Función para procesar formatos en una línea
        const processFormats = (text: string): React.ReactNode => {
            if (!text || typeof text !== 'string') return text

            let result: React.ReactNode = text

            // Procesar imágenes
            if (text.includes('![')) {
                const parts = text.split(/(\!\[.*?\]\(.*?\))/)
                result = parts.map((part, index) => {
                    const imgMatch = part.match(/\!\[(.*?)\]\((.*?)\)/)
                    if (imgMatch) {
                        const [, alt, src] = imgMatch
                        return (
                            <img
                                key={`img-${index}`}
                                src={src}
                                alt={alt}
                                style={{
                                    maxWidth: '100%',
                                    height: isPreview ? '120px' : 'auto',
                                    objectFit: isPreview ? 'cover' : 'contain',
                                    borderRadius: '8px',
                                    margin: '0.5rem 0',
                                    display: 'block'
                                }}
                            />
                        )
                    }
                    return part || null
                }).filter(part => part !== null && part !== '')
                return result
            }

            // Procesar subtítulos
            if (typeof result === 'string' && result.includes('<h2>')) {
                const parts = result.split(/(<h2>.*?<\/h2>)/)
                result = parts.map((part, index) => {
                    const h2Match = part.match(/<h2>(.*?)<\/h2>/)
                    if (h2Match) {
                        return (
                            <h2 key={`h2-${index}`} style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                margin: '1rem 0 0.5rem 0',
                                color: '#1f2937'
                            }}>
                                {h2Match[1]}
                            </h2>
                        )
                    }
                    return part || null
                }).filter(part => part !== null && part !== '')
                return result
            }

            // Procesar colores
            if (typeof result === 'string' && result.includes('<color:')) {
                const parts = result.split(/(<color:.*?>.*?<\/color>)/)
                result = parts.map((part, index) => {
                    const colorMatch = part.match(/<color:(.*?)>(.*?)<\/color>/)
                    if (colorMatch) {
                        const [, color, content] = colorMatch
                        return (
                            <span key={`color-${index}`} style={{ color: color }}>
                                {content}
                            </span>
                        )
                    }
                    return part || null
                }).filter(part => part !== null && part !== '')
                return result
            }

            // Procesar negritas
            if (typeof result === 'string' && result.includes('**')) {
                const parts = result.split(/(\*\*.*?\*\*)/)
                result = parts.map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        const content = part.slice(2, -2)
                        return <strong key={`bold-${index}`}>{content}</strong>
                    }
                    return part || null
                }).filter(part => part !== null && part !== '')
                return result
            }

            // Procesar subrayado
            if (typeof result === 'string' && result.includes('__')) {
                const parts = result.split(/(__.+?__)/)
                result = parts.map((part, index) => {
                    if (part.startsWith('__') && part.endsWith('__')) {
                        const content = part.slice(2, -2)
                        return <u key={`underline-${index}`}>{content}</u>
                    }
                    return part || null
                }).filter(part => part !== null && part !== '')
                return result
            }

            return result
        }

        return processText(content)
    }    // Funciones para likes y comentarios
    // Funciones para likes con Supabase
    const handleLikeStory = async (storyId: string) => {
        if (!user) return // No permitir likes sin estar logueado

        console.log('👍 Dando like a historia:', storyId)

        try {
            // Verificar si ya dio like
            const { data: existingLike, error: checkError } = await supabase
                .from('story_likes')
                .select('id')
                .eq('story_id', storyId)
                .eq('user_id', user.id)
                .single()

            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
                console.error('Error verificando like:', checkError)
                return
            }

            if (existingLike) {
                console.log('Usuario ya dio like a esta historia')
                return
            }

            // Insertar like
            const { error: insertError } = await supabase
                .from('story_likes')
                .insert([{
                    story_id: storyId,
                    user_id: user.id,
                    created_at: new Date().toISOString()
                }])

            if (insertError) {
                console.error('Error insertando like:', insertError)
                return
            }

            // Actualizar estado local
            const updatedStories = stories.map(story => {
                if (story.id === storyId) {
                    return {
                        ...story,
                        likes_count: (story.likes_count || 0) + 1
                    }
                }
                return story
            })
            updateStoriesWithCache(() => updatedStories)

            // Si estamos viendo esta historia, actualizar también selectedStory
            if (selectedStory && selectedStory.id === storyId) {
                setSelectedStory({
                    ...selectedStory,
                    likes_count: (selectedStory.likes_count || 0) + 1
                })
            }

            console.log('✅ Like agregado')
        } catch (error) {
            console.error('Error en handleLikeStory:', error)
        }
    }

    const toggleComments = (storyId: string) => {
        setShowComments(showComments === storyId ? null : storyId)
        setNewComment('') // Limpiar comentario al cambiar
    }

    const handleAddComment = async (storyId: string) => {
        if (newComment.trim() === '') return
        if (!user) return // No permitir comentarios sin estar logueado

        console.log('💬 Agregando comentario a historia:', storyId)

        try {
            // Verificar si ya comentó
            const { data: existingComment, error: checkError } = await supabase
                .from('comments')
                .select('id')
                .eq('story_id', storyId)
                .eq('user_id', user.id)
                .single()

            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
                console.error('Error verificando comentario:', checkError)
                return
            }

            if (existingComment) {
                alert('Ya has comentado en esta historia. Solo se permite un comentario por usuario.')
                return
            }

            // Insertar comentario
            const { data: newCommentData, error: insertError } = await supabase
                .from('comments')
                .insert([{
                    story_id: storyId,
                    user_id: user.id,
                    content: newComment.trim(),
                    created_at: new Date().toISOString()
                }])
                .select(`
                    *,
                    user:users!comments_user_id_fkey(username, name)
                `)
                .single()

            if (insertError) {
                console.error('Error insertando comentario:', insertError)
                return
            }

            // Actualizar estado local
            const updatedStories = stories.map(story => {
                if (story.id === storyId) {
                    return {
                        ...story,
                        comments_count: (story.comments_count || 0) + 1
                    }
                }
                return story
            })
            updateStoriesWithCache(() => updatedStories)

            // Si estamos viendo esta historia, actualizar también selectedStory
            if (selectedStory && selectedStory.id === storyId) {
                setSelectedStory({
                    ...selectedStory,
                    comments_count: (selectedStory.comments_count || 0) + 1
                })
            }

            setNewComment('')
            console.log('✅ Comentario agregado')
        } catch (error) {
            console.error('Error en handleAddComment:', error)
        }
    }

    // Función para cambiar página (sin localStorage)
    const changePage = (page: string) => {
        setCurrentPage(page)
        try {
            sessionStorage.setItem('storyup_current_page', page)
        } catch { }
    }

    // Reset de navegación al hacer logout
    const handleSignOut = () => {
        setCurrentPage('inicio')
        try {
            sessionStorage.setItem('storyup_current_page', 'inicio')
        } catch { }
        signOut()
    }

    // Funciones para manejar el formulario de historia
    const handleStoryFormChange = (field: string, value: string) => {
        setStoryForm(prev => ({
            ...prev,
            [field]: value
        }))
        // Ocultar error de validación si el usuario empieza a completar campos
        if (showValidationError) {
            setShowValidationError(false)
        }
    }

    const validateStoryForm = () => {
        return storyForm.title.trim() !== '' &&
            storyForm.content.trim() !== '' &&
            storyForm.type !== '' &&
            storyForm.genre !== ''
    }

    const handleSubmitStory = async () => {
        if (!validateStoryForm()) {
            setShowValidationError(true)
            return
        }

        if (!user) {
            alert('Debes estar logueado para escribir historias')
            return
        }

        setIsSubmittingStory(true)

        try {
            await saveStory({
                title: storyForm.title,
                content: storyForm.content,
                type: storyForm.type,  // Agregamos el tipo que faltaba
                author: user.username || user.name,
                authorId: user.id,
                genre: storyForm.genre
            })

            // Limpiar formulario
            setStoryForm({
                title: '',
                content: '',
                type: '',
                genre: ''
            })

            // Navegar a la página de historias
            changePage('historias')

        } catch (error) {
            console.error('Error guardando historia:', error)
            alert('Error al guardar la historia. Inténtalo de nuevo.')
        }

        setIsSubmittingStory(false)
    }

    // Función para ver una historia específica
    const viewStory = (story: any) => {
        setSelectedStory(story)
        changePage('leer-historia')
    }

    // Actualizar reloj cada segundo
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Actualizar contador de usuarios solo con datos reales
    useEffect(() => {
        setTotalUsers(allUsers.length)
    }, [allUsers])

    // Cargar mensajes desde Supabase al iniciar
    useEffect(() => {
        loadMessages()
    }, [])

    // Actualizar chat cuando se selecciona un usuario diferente
    useEffect(() => {
        if (selectedUser && user) {
            const userMessages = messages.filter(msg =>
                (msg.from === user.username && msg.to === selectedUser.username) ||
                (msg.from === selectedUser.username && msg.to === user.username)
            )
            setChatMessages(userMessages)
        } else {
            setChatMessages([])
        }
    }, [selectedUser, messages, user])

    // 8 idiomas disponibles
    const languages = {
        es: { name: 'Español', flag: '🇪🇸' },
        en: { name: 'English', flag: '🇺🇸' },
        de: { name: 'Deutsch', flag: '🇩🇪' },
        fr: { name: 'Français', flag: '🇫🇷' },
        zh: { name: '中文', flag: '🇨🇳' },
        ca: { name: 'Català', flag: '🔶' },
        gl: { name: 'Galego', flag: '🔷' },
        eu: { name: 'Euskera', flag: '🔴' }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Debug: Log del valor actual de totalUsers antes del render
    console.log('Valor de totalUsers en render:', totalUsers)

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex' }}>
            {/* Sidebar Fijo */}
            <div style={{
                width: '220px',
                backgroundColor: 'white',
                borderRight: '2px solid #e5e7eb',
                boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '1.5rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '1.5rem',
                        justifyContent: 'center'
                    }}>
                        <img
                            src="/assets/favicon.ico.png"
                            alt="Logo StoryUp"
                            style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                            }}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.outerHTML = '<div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.5rem;">📖</div>';
                            }}
                        />
                        <span style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#3b82f6'
                        }}>
                            StoryUp
                        </span>
                    </div>

                    <nav>
                        <button
                            onClick={() => changePage('inicio')}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                backgroundColor: currentPage === 'inicio' ? '#3b82f6' : 'transparent',
                                color: currentPage === 'inicio' ? 'white' : '#6b7280',
                                border: 'none',
                                borderRadius: '12px',
                                marginBottom: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '500',
                                textAlign: 'left'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>🏠</span>
                            Inicio
                        </button>

                        <button
                            onClick={() => changePage('historias')}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                backgroundColor: currentPage === 'historias' ? '#3b82f6' : 'transparent',
                                color: currentPage === 'historias' ? 'white' : '#6b7280',
                                border: 'none',
                                borderRadius: '12px',
                                marginBottom: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '500',
                                textAlign: 'left'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>�</span>
                            Historias
                        </button>

                        <button
                            onClick={() => changePage('crea-historia')}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                backgroundColor: currentPage === 'crea-historia' ? '#3b82f6' : 'transparent',
                                color: currentPage === 'crea-historia' ? 'white' : '#6b7280',
                                border: 'none',
                                borderRadius: '12px',
                                marginBottom: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '500',
                                textAlign: 'left'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>✏️</span>
                            Crea tu Historia
                        </button>

                        <button
                            onClick={() => changePage('noticias')}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                backgroundColor: currentPage === 'noticias' ? '#3b82f6' : 'transparent',
                                color: currentPage === 'noticias' ? 'white' : '#6b7280',
                                border: 'none',
                                borderRadius: '12px',
                                marginBottom: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '500',
                                textAlign: 'left'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>�</span>
                            Noticias
                        </button>

                        <button
                            onClick={() => changePage('estadisticas')}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                backgroundColor: currentPage === 'estadisticas' ? '#3b82f6' : 'transparent',
                                color: currentPage === 'estadisticas' ? 'white' : '#6b7280',
                                border: 'none',
                                borderRadius: '12px',
                                marginBottom: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '500',
                                textAlign: 'left'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>📊</span>
                            Estadísticas
                        </button>

                        <button
                            onClick={() => changePage('concursos-trofeos')}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                backgroundColor: currentPage === 'concursos-trofeos' ? '#3b82f6' : 'transparent',
                                color: currentPage === 'concursos-trofeos' ? 'white' : '#6b7280',
                                border: 'none',
                                borderRadius: '12px',
                                marginBottom: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '500',
                                textAlign: 'left'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>🏆</span>
                            Concursos y Trofeos
                        </button>

                        <button
                            onClick={() => changePage('perfil')}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                backgroundColor: currentPage === 'perfil' ? '#3b82f6' : 'transparent',
                                color: currentPage === 'perfil' ? 'white' : '#6b7280',
                                border: 'none',
                                borderRadius: '12px',
                                marginBottom: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '500',
                                textAlign: 'left'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>👤</span>
                            Mi Perfil
                        </button>

                        <button
                            onClick={() => changePage('configuracion')}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                backgroundColor: currentPage === 'configuracion' ? '#3b82f6' : 'transparent',
                                color: currentPage === 'configuracion' ? 'white' : '#6b7280',
                                border: 'none',
                                borderRadius: '12px',
                                marginBottom: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '500',
                                textAlign: 'left'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>⚙️</span>
                            Configuración
                        </button>
                    </nav>
                </div>
            </div>

            {/* Contenido Principal */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header según especificaciones originales */}
                <header style={{
                    backgroundColor: 'white',
                    borderBottom: '2px solid #e5e7eb',
                    padding: '1rem 2rem',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr 1fr',
                        alignItems: 'center',
                        gap: '2rem',
                        maxWidth: '1400px',
                        margin: '0 auto'
                    }}>
                        {/* IZQUIERDA: Estadísticas usuarios */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                fontSize: '0.9rem',
                                color: '#6b7280'
                            }}>
                                <span>👥 Inscritos: <strong>{totalUsers}</strong></span>
                                <span>🟢 Online: <strong>1</strong></span>
                            </div>
                        </div>

                        {/* CENTRO: Fecha y Hora */}
                        <div style={{
                            textAlign: 'center',
                            padding: '0.5rem 0.5rem',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1'
                        }}>
                            <div style={{
                                fontSize: '0.8rem',
                                color: '#1e293b',
                                fontWeight: '600'
                            }}>
                                {formatTime(currentTime)}
                            </div>
                        </div>

                        {/* DERECHA: Selector idiomas + Usuario */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            justifyContent: 'flex-end'
                        }}>
                            {/* Selector de 8 idiomas */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <span>{languages[currentLanguage as keyof typeof languages].flag}</span>
                                    <span>{languages[currentLanguage as keyof typeof languages].name}</span>
                                    <span style={{ fontSize: '0.7rem' }}>▼</span>
                                </button>

                                {showLanguageDropdown && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: '0.25rem',
                                        backgroundColor: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                                        minWidth: '180px',
                                        zIndex: 1000
                                    }}>
                                        {Object.entries(languages).map(([code, lang]) => (
                                            <button
                                                key={code}
                                                onClick={() => {
                                                    setCurrentLanguage(code)
                                                    setShowLanguageDropdown(false)
                                                }}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.75rem 1rem',
                                                    backgroundColor: currentLanguage === code ? '#f0f9ff' : 'white',
                                                    border: 'none',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                <span>{lang.flag}</span>
                                                <span>{lang.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleSignOut}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Salir
                            </button>
                        </div>
                    </div>
                </header>

                {/* Contenido de páginas */}
                <main style={{ flex: 1, padding: '2rem' }}>
                    {currentPage === 'feed' && (
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: '2.5rem', color: '#3b82f6', marginBottom: '1rem' }}>
                                📰 Feed
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                                Aquí verás las publicaciones de tus amigos
                            </p>
                        </div>
                    )}

                    {currentPage === 'friends' && (
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: '2.5rem', color: '#10b981', marginBottom: '1rem' }}>
                                👥 Amigos
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                                Gestiona tus amistades
                            </p>
                        </div>
                    )}

                    {currentPage === 'messages' && (
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: '2.5rem', color: '#8b5cf6', marginBottom: '1rem' }}>
                                💬 Mensajes
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                                Chatea con tus amigos
                            </p>
                        </div>
                    )}

                    {currentPage === 'notifications' && (
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: '2.5rem', color: '#f59e0b', marginBottom: '1rem' }}>
                                🔔 Notificaciones
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                                Revisa tus notificaciones
                            </p>
                        </div>
                    )}

                    {currentPage === 'profile' && (
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: '2.5rem', color: '#3b82f6', marginBottom: '1rem' }}>
                                👤 Mi Perfil
                            </h1>
                            <div style={{
                                display: 'inline-block',
                                padding: '2rem',
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                marginTop: '1rem'
                            }}>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    fontSize: '2.5rem',
                                    color: 'white'
                                }}>
                                    👤
                                </div>
                                <h3>@{user.username}</h3>
                                <p style={{ color: '#6b7280' }}>{user.email}</p>
                            </div>
                        </div>
                    )}

                    {currentPage === 'inicio' && (
                        <div style={{
                            maxWidth: '1200px',
                            margin: '0 auto',
                            padding: '2rem'
                        }}>
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                padding: '2.5rem',
                                marginBottom: '2rem',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginBottom: '2rem'
                                }}>
                                    <img
                                        src="/assets/logo-grande.png.png"
                                        alt="StoryUp Logo"
                                        style={{
                                            maxWidth: '200px',
                                            height: 'auto',
                                            marginBottom: '1rem',
                                            borderRadius: '16px',
                                            boxShadow: '0 6px 24px rgba(59, 130, 246, 0.25)',
                                            border: '2px solid white',
                                            background: 'white',
                                            padding: '0.75rem'
                                        }}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            console.log('Error cargando logo-grande.png.png, usando fallback');
                                            target.outerHTML = `<div style="
                                                width: 200px;
                                                height: 120px;
                                                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%);
                                                border-radius: 16px;
                                                display: flex;
                                                flex-direction: column;
                                                align-items: center;
                                                justify-content: center;
                                                margin-bottom: 1rem;
                                                box-shadow: 0 6px 24px rgba(59, 130, 246, 0.25);
                                                border: 2px solid white;
                                                color: white;
                                                font-size: 1.6rem;
                                                font-weight: bold;
                                                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                                            ">
                                                <div style="font-size: 3rem; margin-bottom: 0.5rem;">📖</div>
                                                StoryUp
                                            </div>`;
                                        }}
                                    />
                                    <h1 style={{
                                        fontSize: '2.2rem',
                                        color: '#1e293b',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        margin: 0
                                    }}>
                                        🌟 Bienvenido a StoryUp 🌟
                                    </h1>
                                </div>

                                <div style={{
                                    fontSize: '1.3rem',
                                    lineHeight: '1.8',
                                    color: '#374151',
                                    textAlign: 'center',
                                    maxWidth: '900px',
                                    margin: '0 auto'
                                }}>
                                    <p style={{ marginBottom: '1.5rem' }}>
                                        StoryUp se ha creado con la única intención de que <strong style={{ color: '#3b82f6' }}>"Usuarios de todo el mundo"</strong>, <strong style={{ color: '#10b981' }}>"Padres e hijos"</strong> y <strong style={{ color: '#8b5cf6' }}>"Docentes y Alumnos"</strong> consigan sacar juntos esa creatividad que todos tenemos o hemos tenido oculta alguna vez en la vida y brillemos con ella.
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: '2rem',
                                        marginTop: '2rem',
                                        flexWrap: 'wrap'
                                    }}>
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '1.5rem',
                                            backgroundColor: '#f0f9ff',
                                            borderRadius: '12px',
                                            flex: '1',
                                            minWidth: '200px',
                                            maxWidth: '250px'
                                        }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
                                            <h3 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>Usuarios del Mundo</h3>
                                            <p style={{ fontSize: '1rem', color: '#6b7280' }}>Conecta y comparte historias con personas de todas partes</p>
                                        </div>

                                        <div style={{
                                            textAlign: 'center',
                                            padding: '1.5rem',
                                            backgroundColor: '#f0fdf4',
                                            borderRadius: '12px',
                                            flex: '1',
                                            minWidth: '200px',
                                            maxWidth: '250px'
                                        }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍👩‍👧‍👦</div>
                                            <h3 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Padres e Hijos</h3>
                                            <p style={{ fontSize: '1rem', color: '#6b7280' }}>Crea momentos únicos en familia a través de la creatividad</p>
                                        </div>

                                        <div style={{
                                            textAlign: 'center',
                                            padding: '1.5rem',
                                            backgroundColor: '#faf5ff',
                                            borderRadius: '12px',
                                            flex: '1',
                                            minWidth: '200px',
                                            maxWidth: '250px'
                                        }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👩‍🏫</div>
                                            <h3 style={{ color: '#8b5cf6', marginBottom: '0.5rem' }}>Docentes y Alumnos</h3>
                                            <p style={{ fontSize: '1rem', color: '#6b7280' }}>Fomenta la imaginación en el ámbito educativo</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentPage === 'historias' && (
                        <div style={{
                            minHeight: '100vh',
                            backgroundColor: '#f8fafc',
                            padding: '2rem'
                        }}>
                            <div style={{
                                maxWidth: '1400px',
                                margin: '0 auto'
                            }}>
                                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                    <h1 style={{ fontSize: '2.5rem', color: '#3b82f6', marginBottom: '1rem' }}>
                                        📖 Historias
                                    </h1>
                                    <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                                        Explora las últimas historias creadas por la comunidad
                                    </p>
                                    {/* Debug info */}
                                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                                        Historias encontradas: {stories.length}
                                    </p>
                                </div>

                                {/* Layout con dos columnas */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '2rem',
                                    alignItems: 'start'
                                }}>
                                    {/* COLUMNA IZQUIERDA: Lista de historias */}
                                    <div>
                                        {stories.length > 0 ? (
                                            <div style={{
                                                backgroundColor: 'white',
                                                borderRadius: '12px',
                                                padding: '2rem',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                border: '1px solid #e5e7eb'
                                            }}>
                                                <h3 style={{
                                                    fontSize: '1.25rem',
                                                    fontWeight: 'bold',
                                                    color: '#1f2937',
                                                    marginBottom: '1.5rem',
                                                    borderBottom: '2px solid #f3f4f6',
                                                    paddingBottom: '0.75rem'
                                                }}>
                                                    📋 Últimas 25 Historias
                                                </h3>

                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.75rem'
                                                }}>
                                                    {stories.map((story: any, index: number) => (
                                                        <div key={story.id} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            padding: '0.75rem 0',
                                                            borderBottom: index < stories.length - 1 ? '1px solid #f3f4f6' : 'none',
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#f8fafc'
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'transparent'
                                                            }}
                                                        >
                                                            {/* Título clickeable */}
                                                            <div style={{ flex: 1 }}>
                                                                <h4
                                                                    onClick={() => viewStory(story)}
                                                                    style={{
                                                                        fontSize: '1rem',
                                                                        fontWeight: '600',
                                                                        color: '#3b82f6',
                                                                        margin: 0,
                                                                        cursor: 'pointer',
                                                                        textDecoration: 'none',
                                                                        transition: 'color 0.2s'
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        e.currentTarget.style.color = '#1d4ed8'
                                                                        e.currentTarget.style.textDecoration = 'underline'
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.currentTarget.style.color = '#3b82f6'
                                                                        e.currentTarget.style.textDecoration = 'none'
                                                                    }}
                                                                >
                                                                    {story.title}
                                                                </h4>
                                                            </div>

                                                            {/* Autor y fecha */}
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '2rem',
                                                                fontSize: '0.875rem',
                                                                color: '#6b7280'
                                                            }}>
                                                                <span>
                                                                    <strong>Por:</strong> {story.author_name || user?.username || 'Usuario desconocido'}
                                                                </span>
                                                                <span>
                                                                    {new Date(story.created_at).toLocaleDateString('es-ES')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{
                                                textAlign: 'center',
                                                backgroundColor: 'white',
                                                borderRadius: '12px',
                                                padding: '3rem',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                            }}>
                                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
                                                <h3 style={{
                                                    fontSize: '1.5rem',
                                                    color: '#1f2937',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    No hay historias aún
                                                </h3>
                                                <p style={{
                                                    fontSize: '1rem',
                                                    color: '#6b7280'
                                                }}>
                                                    ¡Sé el primero en crear una historia increíble!
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* COLUMNA DERECHA: Bloque adicional */}
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '2rem',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        <h3 style={{
                                            fontSize: '1.25rem',
                                            fontWeight: 'bold',
                                            color: '#1f2937',
                                            marginBottom: '1.5rem',
                                            borderBottom: '2px solid #f3f4f6',
                                            paddingBottom: '0.75rem'
                                        }}>
                                            📊 Estadísticas de Historias
                                        </h3>

                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '1.5rem'
                                        }}>
                                            {/* Total de historias */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '1rem',
                                                backgroundColor: '#f8fafc',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                <span style={{
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    color: '#374151',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    📚 Total de Historias
                                                </span>
                                                <span style={{
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold',
                                                    color: '#3b82f6'
                                                }}>
                                                    {stories.length}
                                                </span>
                                            </div>

                                            {/* Historias por autor */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '1rem',
                                                backgroundColor: '#f0fdf4',
                                                borderRadius: '8px',
                                                border: '1px solid #bbf7d0'
                                            }}>
                                                <span style={{
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    color: '#374151',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    ✍️ Tus Historias
                                                </span>
                                                <span style={{
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold',
                                                    color: '#16a34a'
                                                }}>
                                                    {stories.filter((story: any) => story.author_name === user?.username || story.author_name === user?.name).length}
                                                </span>
                                            </div>

                                            {/* Total de likes */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '1rem',
                                                backgroundColor: '#fef3c7',
                                                borderRadius: '8px',
                                                border: '1px solid #fcd34d'
                                            }}>
                                                <span style={{
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    color: '#374151',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    ❤️ Total de Likes
                                                </span>
                                                <span style={{
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold',
                                                    color: '#d97706'
                                                }}>
                                                    {stories.reduce((total: number, story: any) => total + (story.likes?.length || 0), 0)}
                                                </span>
                                            </div>

                                            {/* Separator */}
                                            <div style={{
                                                height: '1px',
                                                backgroundColor: '#e5e7eb',
                                                margin: '1rem 0'
                                            }}></div>

                                            {/* Autores más activos */}
                                            <div>
                                                <h4 style={{
                                                    fontSize: '1.1rem',
                                                    fontWeight: '600',
                                                    color: '#1f2937',
                                                    marginBottom: '1rem'
                                                }}>
                                                    🏆 Autores más Activos
                                                </h4>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.75rem'
                                                }}>
                                                    {(() => {
                                                        const authorCounts = stories.reduce((acc: any, story: any) => {
                                                            const authorName = story.author_name || 'Usuario desconocido'
                                                            acc[authorName] = (acc[authorName] || 0) + 1
                                                            return acc
                                                        }, {})
                                                        return Object.entries(authorCounts)
                                                            .sort(([, a]: any, [, b]: any) => (b as number) - (a as number))
                                                            .slice(0, 5)
                                                            .map(([author, count]: any, index: number) => (
                                                                <div key={author} style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    padding: '0.5rem',
                                                                    backgroundColor: index === 0 ? '#fef3c7' : '#f8fafc',
                                                                    borderRadius: '6px',
                                                                    border: `1px solid ${index === 0 ? '#fcd34d' : '#e2e8f0'}`
                                                                }}>
                                                                    <span style={{
                                                                        fontSize: '0.9rem',
                                                                        color: '#374151',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.5rem'
                                                                    }}>
                                                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📝'}
                                                                        {author}
                                                                    </span>
                                                                    <span style={{
                                                                        fontSize: '1rem',
                                                                        fontWeight: 'bold',
                                                                        color: index === 0 ? '#d97706' : '#6b7280'
                                                                    }}>
                                                                        {count}
                                                                    </span>
                                                                </div>
                                                            ))
                                                    })()}
                                                </div>
                                            </div>

                                            {/* Separator */}
                                            <div style={{
                                                height: '1px',
                                                backgroundColor: '#e5e7eb',
                                                margin: '1.5rem 0'
                                            }}></div>

                                            {/* Categorías de Historias */}
                                            <div>
                                                <h4 style={{
                                                    fontSize: '1.1rem',
                                                    fontWeight: '600',
                                                    color: '#1f2937',
                                                    marginBottom: '1rem'
                                                }}>
                                                    � Tipos de Historias
                                                </h4>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.5rem',
                                                    marginBottom: '2rem'
                                                }}>
                                                    {(() => {
                                                        const typeCategories = [
                                                            { name: 'Historias Reales', icon: '📰', type: 'real', color: '#dcfce7', border: '#bbf7d0', text: '#16a34a' },
                                                            { name: 'Historias de Ficción', icon: '🌟', type: 'fiction', color: '#e0e7ff', border: '#c7d2fe', text: '#4338ca' }
                                                        ]

                                                        return typeCategories.map(category => {
                                                            const count = stories.filter((story: any) => {
                                                                // Usar el campo 'type' de la historia para clasificar
                                                                const storyType = story.type?.toLowerCase() || ''

                                                                if (category.type === 'real') {
                                                                    return storyType === 'real'
                                                                }
                                                                if (category.type === 'fiction') {
                                                                    return storyType === 'ficcion'
                                                                }
                                                                return false
                                                            }).length

                                                            return (
                                                                <div key={category.type} style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    padding: '0.75rem',
                                                                    backgroundColor: category.color,
                                                                    borderRadius: '6px',
                                                                    border: `1px solid ${category.border}`
                                                                }}>
                                                                    <span style={{
                                                                        fontSize: '0.9rem',
                                                                        color: '#374151',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.5rem'
                                                                    }}>
                                                                        {category.icon} {category.name}
                                                                    </span>
                                                                    <span style={{
                                                                        fontSize: '1rem',
                                                                        fontWeight: 'bold',
                                                                        color: category.text
                                                                    }}>
                                                                        {count}
                                                                    </span>
                                                                </div>
                                                            )
                                                        })
                                                    })()}
                                                </div>

                                                <h4 style={{
                                                    fontSize: '1.1rem',
                                                    fontWeight: '600',
                                                    color: '#1f2937',
                                                    marginBottom: '1rem'
                                                }}>
                                                    🎭 Géneros de Historias
                                                </h4>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.5rem'
                                                }}>
                                                    {(() => {
                                                        const genreCategories = [
                                                            { name: 'Fantasía', icon: '🧙‍♂️', type: 'fantasy', color: '#fdf4ff', border: '#f3e8ff', text: '#a855f7' },
                                                            { name: 'Aventura', icon: '🗺️', type: 'adventure', color: '#fef3c7', border: '#fcd34d', text: '#d97706' },
                                                            { name: 'Romance', icon: '💕', type: 'romance', color: '#fce7f3', border: '#f9a8d4', text: '#ec4899' },
                                                            { name: 'Misterio', icon: '🔍', type: 'mystery', color: '#f1f5f9', border: '#cbd5e1', text: '#475569' },
                                                            { name: 'Educativa', icon: '🎓', type: 'educational', color: '#ecfdf5', border: '#a7f3d0', text: '#059669' },
                                                            { name: 'Otros Géneros', icon: '📖', type: 'other', color: '#fafafa', border: '#e4e4e7', text: '#71717a' }
                                                        ]

                                                        return genreCategories.map(category => {
                                                            const count = stories.filter((story: any) => {
                                                                // Usar el campo genre guardado en la historia (insensible a mayúsculas)
                                                                const storyGenre = story.genre?.toLowerCase() || ''
                                                                switch (category.type) {
                                                                    case 'fantasy':
                                                                        return storyGenre === 'fantasía' || storyGenre === 'fantasia'
                                                                    case 'adventure':
                                                                        return storyGenre === 'aventura'
                                                                    case 'romance':
                                                                        return storyGenre === 'romance'
                                                                    case 'mystery':
                                                                        return storyGenre === 'misterio'
                                                                    case 'educational':
                                                                        return storyGenre === 'educativa'
                                                                    case 'other':
                                                                        // "Otros Géneros" para historias sin género específico o géneros no listados
                                                                        return !storyGenre || storyGenre === '' ||
                                                                            (storyGenre !== 'fantasía' &&
                                                                                storyGenre !== 'fantasia' &&
                                                                                storyGenre !== 'aventura' &&
                                                                                storyGenre !== 'romance' &&
                                                                                storyGenre !== 'misterio' &&
                                                                                storyGenre !== 'educativa' &&
                                                                                storyGenre !== 'real')
                                                                    default:
                                                                        return false
                                                                }
                                                            }).length

                                                            return (
                                                                <div key={category.type} style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    padding: '0.75rem',
                                                                    backgroundColor: category.color,
                                                                    borderRadius: '6px',
                                                                    border: `1px solid ${category.border}`
                                                                }}>
                                                                    <span style={{
                                                                        fontSize: '0.9rem',
                                                                        color: '#374151',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.5rem'
                                                                    }}>
                                                                        {category.icon} {category.name}
                                                                    </span>
                                                                    <span style={{
                                                                        fontSize: '1rem',
                                                                        fontWeight: 'bold',
                                                                        color: category.text
                                                                    }}>
                                                                        {count}
                                                                    </span>
                                                                </div>
                                                            )
                                                        })
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}                    {currentPage === 'crea-historia' && (
                        <div style={{
                            minHeight: '100vh',
                            backgroundColor: '#f8fafc',
                            padding: '2rem'
                        }}>
                            <div style={{
                                maxWidth: '1200px',
                                margin: '0 auto',
                                display: 'grid',
                                gridTemplateColumns: '1fr 300px',
                                gap: '2rem'
                            }}>
                                {/* Área principal de creación */}
                                <div style={{
                                    backgroundColor: 'white',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}>
                                    <h1 style={{
                                        fontSize: '2rem',
                                        fontWeight: 'bold',
                                        color: '#1f2937',
                                        marginBottom: '2rem',
                                        textAlign: 'center'
                                    }}>✏️ Crea tu Historia</h1>

                                    {/* Campo de título */}
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Escribe el título de tu historia..."
                                            value={storyForm.title}
                                            onChange={(e) => handleStoryFormChange('title', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                fontSize: '1.2rem',
                                                fontWeight: '600',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                outline: 'none',
                                                transition: 'border-color 0.2s'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                        />
                                    </div>

                                    {/* Barra de herramientas de formato */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                        marginBottom: '1rem',
                                        padding: '0.75rem',
                                        backgroundColor: '#f8fafc',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        <button
                                            onClick={formatBold}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                fontWeight: 'bold',
                                                backgroundColor: 'white',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem'
                                            }}
                                            title="Negrita (Ctrl+B)"
                                        >
                                            B
                                        </button>

                                        <button
                                            onClick={formatUnderline}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                textDecoration: 'underline',
                                                backgroundColor: 'white',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem'
                                            }}
                                            title="Subrayado"
                                        >
                                            U
                                        </button>

                                        <input
                                            type="color"
                                            onChange={(e) => insertTextAtCursor(`<span style="color: ${e.target.value}">`, '</span>')}
                                            style={{
                                                width: '40px',
                                                height: '34px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                            title="Color de texto"
                                        />

                                        <select
                                            onChange={(e) => {
                                                if (e.target.value !== 'Normal') {
                                                    insertSubtitle(e.target.value)
                                                    e.target.value = 'Normal' // Reset selection
                                                }
                                            }}
                                            style={{
                                                padding: '0.5rem',
                                                backgroundColor: 'white',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option>Normal</option>
                                            <option>Subtítulo 1</option>
                                            <option>Subtítulo 2</option>
                                            <option>Subtítulo 3</option>
                                        </select>

                                        <button
                                            onClick={handleImageUpload}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                backgroundColor: '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem'
                                            }}
                                            title="Insertar imagen"
                                        >
                                            📷 Imagen
                                        </button>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            style={{ display: 'none' }}
                                            id="imageUpload"
                                        />
                                    </div>

                                    {/* Área de escritura */}
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <textarea
                                            ref={textareaRef}
                                            placeholder="Escribe tu historia aquí...

Érase una vez..."
                                            value={storyForm.content}
                                            onChange={(e) => handleStoryFormChange('content', e.target.value)}
                                            style={{
                                                width: '100%',
                                                height: '400px',
                                                padding: '1.5rem',
                                                fontSize: '1rem',
                                                lineHeight: '1.6',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                resize: 'vertical',
                                                fontFamily: 'inherit',
                                                outline: 'none',
                                                transition: 'border-color 0.2s'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                        />
                                    </div>

                                    {/* Mensaje de error de validación */}
                                    {showValidationError && (
                                        <div style={{
                                            backgroundColor: '#fef2f2',
                                            border: '1px solid #fecaca',
                                            borderRadius: '8px',
                                            padding: '1rem',
                                            marginBottom: '1rem',
                                            textAlign: 'center',
                                            color: '#dc2626'
                                        }}>
                                            ⚠️ Por favor, completa todos los campos: título, historia, tipo y género.
                                        </div>
                                    )}

                                    {/* Botón Enviar */}
                                    <div style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={handleSubmitStory}
                                            disabled={isSubmittingStory}
                                            style={{
                                                padding: '1rem 2rem',
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                backgroundColor: isSubmittingStory ? '#9ca3af' : '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: isSubmittingStory ? 'not-allowed' : 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isSubmittingStory) {
                                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2563eb'
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isSubmittingStory) {
                                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3b82f6'
                                                }
                                            }}
                                        >
                                            {isSubmittingStory ? '📤 Enviando...' : '📤 Enviar Historia'}
                                        </button>
                                    </div>
                                </div>

                                {/* Barra lateral */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.5rem'
                                }}>
                                    {/* Tipo de historia */}
                                    <div style={{
                                        backgroundColor: 'white',
                                        padding: '1.5rem',
                                        borderRadius: '12px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            color: '#1f2937',
                                            marginBottom: '1rem'
                                        }}>📝 Tipo de Historia</h3>

                                        <select
                                            value={storyForm.type}
                                            onChange={(e) => handleStoryFormChange('type', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                backgroundColor: 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="">Selecciona...</option>
                                            <option value="real">📰 Real</option>
                                            <option value="ficcion">🌟 Ficción</option>
                                        </select>
                                    </div>

                                    {/* Género */}
                                    <div style={{
                                        backgroundColor: 'white',
                                        padding: '1.5rem',
                                        borderRadius: '12px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            color: '#1f2937',
                                            marginBottom: '1rem'
                                        }}>🎭 Género</h3>

                                        <select
                                            value={storyForm.genre}
                                            onChange={(e) => handleStoryFormChange('genre', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                backgroundColor: 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="">Selecciona...</option>
                                            <option value="fantasia">🧙‍♂️ Fantasía</option>
                                            <option value="aventura">🗺️ Aventura</option>
                                            <option value="romance">💕 Romance</option>
                                            <option value="misterio">🔍 Misterio</option>
                                            <option value="educativa">📚 Educativa</option>
                                            <option value="otros">🎨 Otros</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentPage === 'leer-historia' && selectedStory && (
                        <div style={{
                            minHeight: '100vh',
                            backgroundColor: '#f8fafc',
                            padding: '2rem'
                        }}>
                            <div style={{
                                maxWidth: '800px',
                                margin: '0 auto'
                            }}>
                                {/* Historia completa */}
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    padding: '3rem',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    <h1 style={{
                                        fontSize: '2.5rem',
                                        fontWeight: 'bold',
                                        color: '#1f2937',
                                        marginBottom: '2rem',
                                        lineHeight: '1.2'
                                    }}>
                                        {selectedStory.title}
                                    </h1>

                                    {/* Metadata de la historia */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        alignItems: 'center',
                                        marginBottom: '3rem',
                                        paddingBottom: '2rem',
                                        borderBottom: '2px solid #f3f4f6'
                                    }}>
                                        <span style={{
                                            fontSize: '1rem',
                                            color: '#6b7280'
                                        }}>
                                            Por <strong>{selectedStory.author}</strong>
                                        </span>
                                        <span style={{
                                            backgroundColor: selectedStory.type === 'real' ? '#dcfdf4' : '#ddd6fe',
                                            color: selectedStory.type === 'real' ? '#065f46' : '#5b21b6',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '12px',
                                            fontSize: '0.875rem',
                                            fontWeight: '600'
                                        }}>
                                            {selectedStory.type === 'real' ? '📰 Real' : '🌟 Ficción'}
                                        </span>
                                        <span style={{
                                            backgroundColor: '#f3f4f6',
                                            color: '#374151',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '12px',
                                            fontSize: '0.875rem',
                                            fontWeight: '600'
                                        }}>
                                            {selectedStory.genre === 'fantasia' && '🧙‍♂️ Fantasía'}
                                            {selectedStory.genre === 'aventura' && '🗺️ Aventura'}
                                            {selectedStory.genre === 'romance' && '💕 Romance'}
                                            {selectedStory.genre === 'misterio' && '🔍 Misterio'}
                                            {selectedStory.genre === 'educativa' && '📚 Educativa'}
                                            {selectedStory.genre === 'otros' && '🎨 Otros'}
                                        </span>
                                        <span style={{
                                            fontSize: '0.875rem',
                                            color: '#9ca3af'
                                        }}>
                                            {new Date(selectedStory.createdAt).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    {/* Contenido de la historia */}
                                    <div style={{
                                        fontSize: '1.125rem',
                                        lineHeight: '1.8',
                                        color: '#374151',
                                        whiteSpace: 'pre-wrap',
                                        marginBottom: '3rem'
                                    }}>
                                        {renderContentWithFormat(selectedStory.content)}
                                    </div>

                                    {/* Interacciones */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        alignItems: 'center',
                                        paddingTop: '2rem',
                                        borderTop: '2px solid #f3f4f6'
                                    }}>
                                        <button
                                            onClick={() => handleLikeStory(selectedStory.id)}
                                            disabled={user && selectedStory.likedBy && selectedStory.likedBy.includes(user.username)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.75rem 1.5rem',
                                                backgroundColor: user && selectedStory.likedBy && selectedStory.likedBy.includes(user.username)
                                                    ? '#dbeafe' : '#f3f4f6',
                                                border: `1px solid ${user && selectedStory.likedBy && selectedStory.likedBy.includes(user.username)
                                                    ? '#3b82f6' : '#d1d5db'}`,
                                                borderRadius: '8px',
                                                cursor: user && selectedStory.likedBy && selectedStory.likedBy.includes(user.username)
                                                    ? 'not-allowed' : 'pointer',
                                                fontSize: '1rem',
                                                color: user && selectedStory.likedBy && selectedStory.likedBy.includes(user.username)
                                                    ? '#1d4ed8' : '#374151',
                                                fontWeight: '500',
                                                transition: 'all 0.2s',
                                                opacity: user && selectedStory.likedBy && selectedStory.likedBy.includes(user.username)
                                                    ? 0.7 : 1
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!user || !selectedStory.likedBy || !selectedStory.likedBy.includes(user.username)) {
                                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#e5e7eb'
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!user || !selectedStory.likedBy || !selectedStory.likedBy.includes(user.username)) {
                                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f3f4f6'
                                                }
                                            }}
                                        >
                                            {user && selectedStory.likedBy && selectedStory.likedBy.includes(user.username)
                                                ? '✅ Ya me gusta' : '👍 Me gusta'} ({selectedStory.likes})
                                        </button>
                                        <button
                                            onClick={() => toggleComments(selectedStory.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.75rem 1.5rem',
                                                backgroundColor: showComments === selectedStory.id ? '#dbeafe' : '#f3f4f6',
                                                border: `1px solid ${showComments === selectedStory.id ? '#3b82f6' : '#d1d5db'}`,
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                color: showComments === selectedStory.id ? '#1d4ed8' : '#374151',
                                                fontWeight: '500',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            💬 Comentarios ({selectedStory.comments.length})
                                        </button>
                                    </div>

                                    {/* Sección de comentarios en página de lectura */}
                                    {showComments === selectedStory.id && (
                                        <div style={{
                                            marginTop: '2rem',
                                            paddingTop: '2rem',
                                            borderTop: '2px solid #f3f4f6'
                                        }}>
                                            <h3 style={{
                                                fontSize: '1.25rem',
                                                fontWeight: '600',
                                                color: '#1f2937',
                                                marginBottom: '1.5rem'
                                            }}>
                                                💬 Comentarios ({selectedStory.comments.length})
                                            </h3>

                                            {/* Lista de comentarios */}
                                            {selectedStory.comments.length > 0 && (
                                                <div style={{
                                                    maxHeight: '400px',
                                                    overflowY: 'auto',
                                                    marginBottom: '1.5rem'
                                                }}>
                                                    {selectedStory.comments.map((comment: any) => (
                                                        <div key={comment.id} style={{
                                                            backgroundColor: '#f8fafc',
                                                            borderRadius: '12px',
                                                            padding: '1.5rem',
                                                            marginBottom: '1rem',
                                                            border: '1px solid #e5e7eb'
                                                        }}>
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                marginBottom: '0.75rem'
                                                            }}>
                                                                <span style={{
                                                                    fontSize: '1rem',
                                                                    fontWeight: '600',
                                                                    color: '#1f2937'
                                                                }}>
                                                                    {comment.author}
                                                                </span>
                                                                <span style={{
                                                                    fontSize: '0.875rem',
                                                                    color: '#9ca3af'
                                                                }}>
                                                                    {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <p style={{
                                                                fontSize: '1rem',
                                                                lineHeight: '1.6',
                                                                color: '#374151',
                                                                margin: '0'
                                                            }}>
                                                                {comment.content}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Formulario para nuevo comentario */}
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '1rem'
                                            }}>
                                                <textarea
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder={(user && selectedStory.commentedBy && selectedStory.commentedBy.includes(user.username))
                                                        ? "Ya has comentado en esta historia..."
                                                        : "Escribe tu comentario sobre esta historia..."}
                                                    disabled={user && selectedStory.commentedBy && selectedStory.commentedBy.includes(user.username)}
                                                    style={{
                                                        width: '100%',
                                                        minHeight: '100px',
                                                        padding: '1rem',
                                                        border: '2px solid #e5e7eb',
                                                        borderRadius: '12px',
                                                        fontSize: '1rem',
                                                        lineHeight: '1.6',
                                                        resize: 'vertical',
                                                        fontFamily: 'inherit',
                                                        outline: 'none',
                                                        transition: 'border-color 0.2s',
                                                        backgroundColor: (user && selectedStory.commentedBy && selectedStory.commentedBy.includes(user.username))
                                                            ? '#f9fafb' : 'white',
                                                        color: (user && selectedStory.commentedBy && selectedStory.commentedBy.includes(user.username))
                                                            ? '#6b7280' : 'inherit',
                                                        cursor: (user && selectedStory.commentedBy && selectedStory.commentedBy.includes(user.username))
                                                            ? 'not-allowed' : 'text'
                                                    }}
                                                    onFocus={(e) => {
                                                        if (!user || !selectedStory.commentedBy || !selectedStory.commentedBy.includes(user.username)) {
                                                            e.target.style.borderColor = '#3b82f6'
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        if (!user || !selectedStory.commentedBy || !selectedStory.commentedBy.includes(user.username)) {
                                                            e.target.style.borderColor = '#e5e7eb'
                                                        }
                                                    }}
                                                />
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => handleAddComment(selectedStory.id)}
                                                        disabled={newComment.trim() === '' || (user && selectedStory.commentedBy && selectedStory.commentedBy.includes(user.username))}
                                                        style={{
                                                            padding: '0.75rem 2rem',
                                                            backgroundColor: (user && selectedStory.commentedBy && selectedStory.commentedBy.includes(user.username))
                                                                ? '#9ca3af'
                                                                : (newComment.trim() === '' ? '#9ca3af' : '#3b82f6'),
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            fontSize: '1rem',
                                                            fontWeight: '600',
                                                            cursor: (newComment.trim() === '' || (user && selectedStory.commentedBy && selectedStory.commentedBy.includes(user.username)))
                                                                ? 'not-allowed' : 'pointer',
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                    >
                                                        {(user && selectedStory.commentedBy && selectedStory.commentedBy.includes(user.username))
                                                            ? '✅ Ya comentaste'
                                                            : '💬 Publicar Comentario'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentPage === 'noticias' && (
                        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
                            {/* Header */}
                            <div style={{
                                backgroundColor: 'white',
                                borderBottom: '1px solid #e5e7eb',
                                padding: '1rem 0'
                            }}>
                                <div style={{
                                    maxWidth: '1200px',
                                    margin: '0 auto',
                                    padding: '0 2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <h1 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: '#f59e0b',
                                        margin: '0'
                                    }}>📰 Noticias StoryUp</h1>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <select style={{
                                            padding: '0.5rem 1rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem'
                                        }}>
                                            <option>Todas las categorías</option>
                                            <option>Actualizaciones</option>
                                            <option>Eventos</option>
                                            <option>Comunidad</option>
                                            <option>Concursos</option>
                                        </select>

                                        <button style={{
                                            backgroundColor: '#f59e0b',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            cursor: 'pointer'
                                        }}>
                                            🔔 Suscribirse
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                maxWidth: '1200px',
                                margin: '0 auto',
                                padding: '2rem',
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr',
                                gap: '2rem'
                            }}>
                                {/* Columna principal */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    {/* Noticia destacada */}
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            height: '200px',
                                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <div style={{
                                                fontSize: '4rem',
                                                color: 'rgba(255,255,255,0.3)'
                                            }}>🚀</div>
                                            <div style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                left: '1rem',
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                color: 'white',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '20px',
                                                fontSize: '0.875rem',
                                                fontWeight: '500'
                                            }}>
                                                🔥 DESTACADO
                                            </div>
                                        </div>

                                        <div style={{ padding: '2rem' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                marginBottom: '1rem'
                                            }}>
                                                <span style={{
                                                    backgroundColor: '#fef3c7',
                                                    color: '#d97706',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500'
                                                }}>
                                                    ACTUALIZACIÓN
                                                </span>
                                                <span style={{
                                                    color: '#6b7280',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    27 de septiembre, 2025
                                                </span>
                                            </div>

                                            <h2 style={{
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold',
                                                color: '#374151',
                                                margin: '0 0 1rem 0'
                                            }}>
                                                Nueva actualización 2.0: Editor mejorado y funciones de colaboración
                                            </h2>

                                            <p style={{
                                                fontSize: '1rem',
                                                color: '#6b7280',
                                                lineHeight: '1.6',
                                                margin: '0 0 1.5rem 0'
                                            }}>
                                                Hemos lanzado la versión 2.0 de StoryUp con un editor completamente renovado,
                                                nuevas herramientas de colaboración en tiempo real y mejoras significativas en el rendimiento.
                                                Descubre todas las novedades que harán de tu experiencia de escritura algo único.
                                            </p>

                                            <button style={{
                                                backgroundColor: '#f59e0b',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.75rem 1.5rem',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                cursor: 'pointer'
                                            }}>
                                                Leer más →
                                            </button>
                                        </div>
                                    </div>

                                    {/* Lista de noticias */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {/* Noticia 1 */}
                                        <div style={{
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            padding: '1.5rem',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                            display: 'flex',
                                            gap: '1.5rem'
                                        }}>
                                            <div style={{
                                                width: '120px',
                                                height: '80px',
                                                backgroundColor: '#dcfce7',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '2rem',
                                                flexShrink: 0
                                            }}>
                                                🎉
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    <span style={{
                                                        backgroundColor: '#dcfce7',
                                                        color: '#16a34a',
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500'
                                                    }}>
                                                        EVENTO
                                                    </span>
                                                    <span style={{
                                                        color: '#6b7280',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        25 de septiembre, 2025
                                                    </span>
                                                </div>

                                                <h3 style={{
                                                    fontSize: '1.125rem',
                                                    fontWeight: '600',
                                                    color: '#374151',
                                                    margin: '0 0 0.5rem 0'
                                                }}>
                                                    ¡Celebramos 50,000 historias publicadas!
                                                </h3>

                                                <p style={{
                                                    fontSize: '0.9rem',
                                                    color: '#6b7280',
                                                    lineHeight: '1.5',
                                                    margin: '0'
                                                }}>
                                                    Hemos alcanzado un hito increíble: 50,000 historias únicas han sido
                                                    publicadas por nuestra comunidad de escritores. ¡Gracias por hacer
                                                    de StoryUp un lugar tan especial!
                                                </p>

                                                <button style={{
                                                    backgroundColor: 'transparent',
                                                    color: '#16a34a',
                                                    border: 'none',
                                                    padding: '0.5rem 0',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer',
                                                    marginTop: '0.5rem'
                                                }}>
                                                    Ver celebración →
                                                </button>
                                            </div>
                                        </div>

                                        {/* Noticia 2 */}
                                        <div style={{
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            padding: '1.5rem',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                            display: 'flex',
                                            gap: '1.5rem'
                                        }}>
                                            <div style={{
                                                width: '120px',
                                                height: '80px',
                                                backgroundColor: '#ede9fe',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '2rem',
                                                flexShrink: 0
                                            }}>
                                                👥
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    <span style={{
                                                        backgroundColor: '#ede9fe',
                                                        color: '#7c3aed',
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500'
                                                    }}>
                                                        COMUNIDAD
                                                    </span>
                                                    <span style={{
                                                        color: '#6b7280',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        20 de septiembre, 2025
                                                    </span>
                                                </div>

                                                <h3 style={{
                                                    fontSize: '1.125rem',
                                                    fontWeight: '600',
                                                    color: '#374151',
                                                    margin: '0 0 0.5rem 0'
                                                }}>
                                                    Nuevos moderadores se unen al equipo
                                                </h3>

                                                <p style={{
                                                    fontSize: '0.9rem',
                                                    color: '#6b7280',
                                                    lineHeight: '1.5',
                                                    margin: '0'
                                                }}>
                                                    Damos la bienvenida a cinco nuevos moderadores que ayudarán a mantener
                                                    nuestra comunidad segura y acogedora. Conoce a los nuevos miembros
                                                    del equipo y sus áreas de especialización.
                                                </p>

                                                <button style={{
                                                    backgroundColor: 'transparent',
                                                    color: '#7c3aed',
                                                    border: 'none',
                                                    padding: '0.5rem 0',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer',
                                                    marginTop: '0.5rem'
                                                }}>
                                                    Conocer al equipo →
                                                </button>
                                            </div>
                                        </div>

                                        {/* Noticia 3 */}
                                        <div style={{
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            padding: '1.5rem',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                            display: 'flex',
                                            gap: '1.5rem'
                                        }}>
                                            <div style={{
                                                width: '120px',
                                                height: '80px',
                                                backgroundColor: '#fef3c7',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '2rem',
                                                flexShrink: 0
                                            }}>
                                                🏆
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    <span style={{
                                                        backgroundColor: '#fee2e2',
                                                        color: '#dc2626',
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500'
                                                    }}>
                                                        CONCURSO
                                                    </span>
                                                    <span style={{
                                                        color: '#6b7280',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        15 de septiembre, 2025
                                                    </span>
                                                </div>

                                                <h3 style={{
                                                    fontSize: '1.125rem',
                                                    fontWeight: '600',
                                                    color: '#374151',
                                                    margin: '0 0 0.5rem 0'
                                                }}>
                                                    Ganadores del Concurso de Verano 2025
                                                </h3>

                                                <p style={{
                                                    fontSize: '0.9rem',
                                                    color: '#6b7280',
                                                    lineHeight: '1.5',
                                                    margin: '0'
                                                }}>
                                                    Conoce a los talentosos escritores que se alzaron con la victoria en nuestro
                                                    concurso más competitivo del año. Sus historias inspiradoras han cautivado
                                                    a miles de lectores.
                                                </p>

                                                <button style={{
                                                    backgroundColor: 'transparent',
                                                    color: '#dc2626',
                                                    border: 'none',
                                                    padding: '0.5rem 0',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer',
                                                    marginTop: '0.5rem'
                                                }}>
                                                    Ver ganadores →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* Noticias rápidas */}
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            color: '#374151',
                                            marginBottom: '1rem'
                                        }}>
                                            ⚡ Noticias Rápidas
                                        </h3>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div style={{
                                                borderLeft: '3px solid #3b82f6',
                                                paddingLeft: '0.75rem'
                                            }}>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                                    Nueva función de comentarios anidados
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                    Los lectores ahora pueden responder directamente a comentarios específicos
                                                </div>
                                            </div>

                                            <div style={{
                                                borderLeft: '3px solid #10b981',
                                                paddingLeft: '0.75rem'
                                            }}>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                                    Mejoras en la búsqueda
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                    Algoritmo mejorado para encontrar historias más relevantes
                                                </div>
                                            </div>

                                            <div style={{
                                                borderLeft: '3px solid #f59e0b',
                                                paddingLeft: '0.75rem'
                                            }}>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                                    Corrección de errores
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                    Solucionados problemas menores de la versión anterior
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Newsletter */}
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            color: '#374151',
                                            marginBottom: '1rem'
                                        }}>
                                            📧 Newsletter Semanal
                                        </h3>

                                        <p style={{
                                            fontSize: '0.875rem',
                                            color: '#6b7280',
                                            marginBottom: '1rem'
                                        }}>
                                            Recibe las últimas noticias, consejos de escritura y destacados
                                            de la comunidad directamente en tu bandeja de entrada.
                                        </p>

                                        <input
                                            type="email"
                                            placeholder="tu@email.com"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '0.875rem',
                                                marginBottom: '0.75rem'
                                            }}
                                        />

                                        <button style={{
                                            width: '100%',
                                            backgroundColor: '#f59e0b',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.75rem',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            cursor: 'pointer'
                                        }}>
                                            Suscribirse
                                        </button>
                                    </div>

                                    {/* Estadísticas */}
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            color: '#374151',
                                            marginBottom: '1rem'
                                        }}>
                                            📊 En Números
                                        </h3>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{ fontSize: '0.875rem' }}>📚 Historias</span>
                                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6' }}>
                                                    50,247
                                                </span>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{ fontSize: '0.875rem' }}>✍️ Escritores</span>
                                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#10b981' }}>
                                                    12,389
                                                </span>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{ fontSize: '0.875rem' }}>👀 Lecturas</span>
                                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f59e0b' }}>
                                                    2.1M
                                                </span>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{ fontSize: '0.875rem' }}>💬 Comentarios</span>
                                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#8b5cf6' }}>
                                                    89,567
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentPage === 'estadisticas' && (
                        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
                            {/* Header */}
                            <div style={{
                                backgroundColor: 'white',
                                borderBottom: '1px solid #e5e7eb',
                                padding: '1rem 0'
                            }}>
                                <div style={{
                                    maxWidth: '1200px',
                                    margin: '0 auto',
                                    padding: '0 2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <h1 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: '#8b5cf6',
                                        margin: '0'
                                    }}>📊 Estadísticas de la Plataforma</h1>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <select style={{
                                            padding: '0.5rem 1rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem'
                                        }}>
                                            <option>Últimos 30 días</option>
                                            <option>Últimos 7 días</option>
                                            <option>Último año</option>
                                            <option>Todo el tiempo</option>
                                        </select>

                                        <button style={{
                                            backgroundColor: '#8b5cf6',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            cursor: 'pointer'
                                        }}>
                                            📥 Exportar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                maxWidth: '1200px',
                                margin: '0 auto',
                                padding: '2rem'
                            }}>
                                {/* Métricas principales */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: '1.5rem',
                                    marginBottom: '2rem'
                                }}>
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        borderLeft: '4px solid #3b82f6'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <h3 style={{
                                                fontSize: '0.875rem',
                                                color: '#6b7280',
                                                margin: '0',
                                                fontWeight: '500'
                                            }}>
                                                Total de Historias
                                            </h3>
                                            <span style={{ fontSize: '1.5rem' }}>📚</span>
                                        </div>

                                        <div style={{
                                            fontSize: '2rem',
                                            fontWeight: 'bold',
                                            color: '#3b82f6',
                                            marginBottom: '0.5rem'
                                        }}>
                                            50,247
                                        </div>

                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#10b981',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <span>↗️</span>
                                            <span>+12% vs mes anterior</span>
                                        </div>
                                    </div>

                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        borderLeft: '4px solid #10b981'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <h3 style={{
                                                fontSize: '0.875rem',
                                                color: '#6b7280',
                                                margin: '0',
                                                fontWeight: '500'
                                            }}>
                                                Escritores Activos
                                            </h3>
                                            <span style={{ fontSize: '1.5rem' }}>✍️</span>
                                        </div>

                                        <div style={{
                                            fontSize: '2rem',
                                            fontWeight: 'bold',
                                            color: '#10b981',
                                            marginBottom: '0.5rem'
                                        }}>
                                            12,389
                                        </div>

                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#10b981',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <span>↗️</span>
                                            <span>+8% vs mes anterior</span>
                                        </div>
                                    </div>

                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        borderLeft: '4px solid #f59e0b'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <h3 style={{
                                                fontSize: '0.875rem',
                                                color: '#6b7280',
                                                margin: '0',
                                                fontWeight: '500'
                                            }}>
                                                Lecturas Mensuales
                                            </h3>
                                            <span style={{ fontSize: '1.5rem' }}>👀</span>
                                        </div>

                                        <div style={{
                                            fontSize: '2rem',
                                            fontWeight: 'bold',
                                            color: '#f59e0b',
                                            marginBottom: '0.5rem'
                                        }}>
                                            2.1M
                                        </div>

                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#10b981',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <span>↗️</span>
                                            <span>+25% vs mes anterior</span>
                                        </div>
                                    </div>

                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        borderLeft: '4px solid #8b5cf6'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <h3 style={{
                                                fontSize: '0.875rem',
                                                color: '#6b7280',
                                                margin: '0',
                                                fontWeight: '500'
                                            }}>
                                                Comentarios
                                            </h3>
                                            <span style={{ fontSize: '1.5rem' }}>💬</span>
                                        </div>

                                        <div style={{
                                            fontSize: '2rem',
                                            fontWeight: 'bold',
                                            color: '#8b5cf6',
                                            marginBottom: '0.5rem'
                                        }}>
                                            89,567
                                        </div>

                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#10b981',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <span>↗️</span>
                                            <span>+18% vs mes anterior</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1fr',
                                    gap: '2rem'
                                }}>
                                    {/* Columna principal */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        {/* Gráfico de actividad */}
                                        <div style={{
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            padding: '2rem',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}>
                                            <h3 style={{
                                                fontSize: '1.25rem',
                                                fontWeight: '600',
                                                color: '#374151',
                                                marginBottom: '1.5rem'
                                            }}>
                                                📈 Actividad de los Últimos 30 Días
                                            </h3>

                                            {/* Gráfico simulado */}
                                            <div style={{
                                                height: '200px',
                                                backgroundColor: '#f8fafc',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                justifyContent: 'space-around',
                                                padding: '1rem',
                                                gap: '4px'
                                            }}>
                                                {Array.from({ length: 30 }, (_, i) => (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            backgroundColor: '#3b82f6',
                                                            width: '8px',
                                                            height: `${Math.random() * 120 + 20}px`,
                                                            borderRadius: '2px',
                                                            opacity: 0.7 + Math.random() * 0.3
                                                        }}
                                                    />
                                                ))}
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginTop: '1rem',
                                                fontSize: '0.75rem',
                                                color: '#6b7280'
                                            }}>
                                                <span>Hace 30 días</span>
                                                <span>Hace 15 días</span>
                                                <span>Hoy</span>
                                            </div>
                                        </div>

                                        {/* Géneros más populares */}
                                        <div style={{
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            padding: '2rem',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}>
                                            <h3 style={{
                                                fontSize: '1.25rem',
                                                fontWeight: '600',
                                                color: '#374151',
                                                marginBottom: '1.5rem'
                                            }}>
                                                🎭 Géneros Más Populares
                                            </h3>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <span style={{ fontSize: '1.5rem' }}>🧙‍♂️</span>
                                                        <span style={{ fontSize: '1rem', fontWeight: '500' }}>Fantasía</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{
                                                            width: '100px',
                                                            height: '8px',
                                                            backgroundColor: '#e5e7eb',
                                                            borderRadius: '4px',
                                                            overflow: 'hidden'
                                                        }}>
                                                            <div style={{
                                                                width: '85%',
                                                                height: '100%',
                                                                backgroundColor: '#8b5cf6',
                                                                borderRadius: '4px'
                                                            }} />
                                                        </div>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: '600', minWidth: '50px' }}>
                                                            12,450
                                                        </span>
                                                    </div>
                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <span style={{ fontSize: '1.5rem' }}>🗺️</span>
                                                        <span style={{ fontSize: '1rem', fontWeight: '500' }}>Aventura</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{
                                                            width: '100px',
                                                            height: '8px',
                                                            backgroundColor: '#e5e7eb',
                                                            borderRadius: '4px',
                                                            overflow: 'hidden'
                                                        }}>
                                                            <div style={{
                                                                width: '72%',
                                                                height: '100%',
                                                                backgroundColor: '#10b981',
                                                                borderRadius: '4px'
                                                            }} />
                                                        </div>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: '600', minWidth: '50px' }}>
                                                            9,876
                                                        </span>
                                                    </div>
                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <span style={{ fontSize: '1.5rem' }}>💕</span>
                                                        <span style={{ fontSize: '1rem', fontWeight: '500' }}>Romance</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{
                                                            width: '100px',
                                                            height: '8px',
                                                            backgroundColor: '#e5e7eb',
                                                            borderRadius: '4px',
                                                            overflow: 'hidden'
                                                        }}>
                                                            <div style={{
                                                                width: '68%',
                                                                height: '100%',
                                                                backgroundColor: '#f59e0b',
                                                                borderRadius: '4px'
                                                            }} />
                                                        </div>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: '600', minWidth: '50px' }}>
                                                            8,234
                                                        </span>
                                                    </div>
                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <span style={{ fontSize: '1.5rem' }}>🔍</span>
                                                        <span style={{ fontSize: '1rem', fontWeight: '500' }}>Misterio</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{
                                                            width: '100px',
                                                            height: '8px',
                                                            backgroundColor: '#e5e7eb',
                                                            borderRadius: '4px',
                                                            overflow: 'hidden'
                                                        }}>
                                                            <div style={{
                                                                width: '55%',
                                                                height: '100%',
                                                                backgroundColor: '#3b82f6',
                                                                borderRadius: '4px'
                                                            }} />
                                                        </div>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: '600', minWidth: '50px' }}>
                                                            6,892
                                                        </span>
                                                    </div>
                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <span style={{ fontSize: '1.5rem' }}>📚</span>
                                                        <span style={{ fontSize: '1rem', fontWeight: '500' }}>Educativa</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{
                                                            width: '100px',
                                                            height: '8px',
                                                            backgroundColor: '#e5e7eb',
                                                            borderRadius: '4px',
                                                            overflow: 'hidden'
                                                        }}>
                                                            <div style={{
                                                                width: '45%',
                                                                height: '100%',
                                                                backgroundColor: '#ef4444',
                                                                borderRadius: '4px'
                                                            }} />
                                                        </div>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: '600', minWidth: '50px' }}>
                                                            5,445
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {/* Top escritores */}
                                        <div style={{
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            padding: '1.5rem',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}>
                                            <h3 style={{
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                color: '#374151',
                                                marginBottom: '1rem'
                                            }}>
                                                🌟 Top Escritores
                                            </h3>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '0.5rem 0'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontSize: '1.2rem' }}>🥇</span>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>María González</span>
                                                    </div>
                                                    <span style={{ fontSize: '0.875rem', color: '#10b981' }}>247 historias</span>
                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '0.5rem 0'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontSize: '1.2rem' }}>🥈</span>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Carlos Ruiz</span>
                                                    </div>
                                                    <span style={{ fontSize: '0.875rem', color: '#10b981' }}>189 historias</span>
                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '0.5rem 0'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontSize: '1.2rem' }}>🥉</span>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Ana López</span>
                                                    </div>
                                                    <span style={{ fontSize: '0.875rem', color: '#10b981' }}>156 historias</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actividad reciente */}
                                        <div style={{
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            padding: '1.5rem',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}>
                                            <h3 style={{
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                color: '#374151',
                                                marginBottom: '1rem'
                                            }}>
                                                ⚡ Actividad Reciente
                                            </h3>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <div style={{
                                                    borderLeft: '3px solid #3b82f6',
                                                    paddingLeft: '0.75rem'
                                                }}>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                                        Nueva historia publicada
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                        "El Dragón Perdido" por Elena M.
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                        hace 5 minutos
                                                    </div>
                                                </div>

                                                <div style={{
                                                    borderLeft: '3px solid #10b981',
                                                    paddingLeft: '0.75rem'
                                                }}>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                                        Usuario registrado
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                        @escritor_novato se unió
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                        hace 12 minutos
                                                    </div>
                                                </div>

                                                <div style={{
                                                    borderLeft: '3px solid #f59e0b',
                                                    paddingLeft: '0.75rem'
                                                }}>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                                        Concurso iniciado
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                        "Relatos de Medianoche"
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                        hace 1 hora
                                                    </div>
                                                </div>

                                                <div style={{
                                                    borderLeft: '3px solid #8b5cf6',
                                                    paddingLeft: '0.75rem'
                                                }}>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                                        Comentario destacado
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                        En "Aventuras Espaciales"
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                        hace 2 horas
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Estadísticas rápidas */}
                                        <div style={{
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            padding: '1.5rem',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}>
                                            <h3 style={{
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                color: '#374151',
                                                marginBottom: '1rem'
                                            }}>
                                                📋 Resumen del Día
                                            </h3>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <span style={{ fontSize: '0.875rem' }}>📝 Nuevas historias</span>
                                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6' }}>
                                                        23
                                                    </span>
                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <span style={{ fontSize: '0.875rem' }}>👥 Nuevos usuarios</span>
                                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#10b981' }}>
                                                        47
                                                    </span>
                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <span style={{ fontSize: '0.875rem' }}>💬 Comentarios</span>
                                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f59e0b' }}>
                                                        156
                                                    </span>
                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <span style={{ fontSize: '0.875rem' }}>❤️ Me gusta</span>
                                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#8b5cf6' }}>
                                                        892
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentPage === 'concursos' && (
                        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
                            {/* Header */}
                            <div style={{
                                backgroundColor: 'white',
                                borderBottom: '1px solid #e5e7eb',
                                padding: '1rem 0'
                            }}>
                                <div style={{
                                    maxWidth: '1200px',
                                    margin: '0 auto',
                                    padding: '0 2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    <h1 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: '#ef4444',
                                        margin: '0'
                                    }}>🏆 Concursos y Trofeos</h1>
                                </div>
                            </div>

                            <div style={{
                                maxWidth: '1200px',
                                margin: '0 auto',
                                padding: '2rem',
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr',
                                gap: '2rem'
                            }}>
                                {/* Panel principal */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    {/* Concurso destacado */}
                                    <div style={{
                                        backgroundColor: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        borderRadius: '16px',
                                        padding: '2rem',
                                        color: 'white',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '-20px',
                                            right: '-20px',
                                            fontSize: '8rem',
                                            opacity: '0.1'
                                        }}>🏆</div>

                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <div style={{
                                                display: 'inline-block',
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '20px',
                                                fontSize: '0.875rem',
                                                marginBottom: '1rem'
                                            }}>
                                                🔥 CONCURSO DESTACADO
                                            </div>

                                            <h2 style={{
                                                fontSize: '2rem',
                                                fontWeight: 'bold',
                                                margin: '0 0 1rem 0'
                                            }}>
                                                Gran Concurso de Historias de Aventura 2025
                                            </h2>

                                            <p style={{
                                                fontSize: '1.1rem',
                                                margin: '0 0 1.5rem 0',
                                                opacity: '0.9'
                                            }}>
                                                Participa en nuestro concurso más épico del año. Crea una historia de aventuras que transporte a los lectores a mundos increíbles.
                                            </p>

                                            <div style={{
                                                display: 'flex',
                                                gap: '2rem',
                                                marginBottom: '1.5rem'
                                            }}>
                                                <div>
                                                    <div style={{ fontSize: '0.875rem', opacity: '0.8' }}>Premio</div>
                                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>💰 $1,000 USD</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.875rem', opacity: '0.8' }}>Finaliza en</div>
                                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>⏰ 15 días</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.875rem', opacity: '0.8' }}>Participantes</div>
                                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>👥 247 writers</div>
                                                </div>
                                            </div>

                                            <button style={{
                                                backgroundColor: 'white',
                                                color: '#ef4444',
                                                border: 'none',
                                                padding: '0.75rem 2rem',
                                                borderRadius: '25px',
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}>
                                                🚀 ¡Participar Ahora!
                                            </button>
                                        </div>
                                    </div>

                                    {/* Lista de concursos activos */}
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '2rem',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}>
                                        <h3 style={{
                                            fontSize: '1.25rem',
                                            fontWeight: '600',
                                            color: '#374151',
                                            marginBottom: '1.5rem'
                                        }}>
                                            🎯 Concursos Activos
                                        </h3>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            {/* Concurso 1 */}
                                            <div style={{
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '12px',
                                                padding: '1.5rem',
                                                transition: 'all 0.2s ease',
                                                cursor: 'pointer'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    marginBottom: '1rem'
                                                }}>
                                                    <div>
                                                        <h4 style={{
                                                            fontSize: '1.1rem',
                                                            fontWeight: '600',
                                                            color: '#374151',
                                                            margin: '0 0 0.5rem 0'
                                                        }}>
                                                            📚 Concurso de Historias Educativas
                                                        </h4>
                                                        <p style={{
                                                            fontSize: '0.9rem',
                                                            color: '#6b7280',
                                                            margin: '0'
                                                        }}>
                                                            Crea contenido educativo que inspire a estudiantes de todas las edades
                                                        </p>
                                                    </div>
                                                    <div style={{
                                                        backgroundColor: '#dcfce7',
                                                        color: '#16a34a',
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500'
                                                    }}>
                                                        ACTIVO
                                                    </div>
                                                </div>

                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                                    gap: '1rem',
                                                    marginBottom: '1rem'
                                                }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Premio</div>
                                                        <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>🏆 $500</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Termina</div>
                                                        <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>⏰ 8 días</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Participantes</div>
                                                        <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>👥 89</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Dificultad</div>
                                                        <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>⭐⭐⭐</div>
                                                    </div>
                                                </div>

                                                <button style={{
                                                    backgroundColor: '#3b82f6',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '6px',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer'
                                                }}>
                                                    Ver Detalles
                                                </button>
                                            </div>

                                            {/* Concurso 2 */}
                                            <div style={{
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '12px',
                                                padding: '1.5rem',
                                                transition: 'all 0.2s ease',
                                                cursor: 'pointer'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    marginBottom: '1rem'
                                                }}>
                                                    <div>
                                                        <h4 style={{
                                                            fontSize: '1.1rem',
                                                            fontWeight: '600',
                                                            color: '#374151',
                                                            margin: '0 0 0.5rem 0'
                                                        }}>
                                                            🌙 Relatos de Medianoche
                                                        </h4>
                                                        <p style={{
                                                            fontSize: '0.9rem',
                                                            color: '#6b7280',
                                                            margin: '0'
                                                        }}>
                                                            Historias cortas de misterio y suspenso para leer antes de dormir
                                                        </p>
                                                    </div>
                                                    <div style={{
                                                        backgroundColor: '#fef3c7',
                                                        color: '#d97706',
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500'
                                                    }}>
                                                        PRÓXIMO
                                                    </div>
                                                </div>

                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                                    gap: '1rem',
                                                    marginBottom: '1rem'
                                                }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Premio</div>
                                                        <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>🏆 $300</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Inicia</div>
                                                        <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>📅 3 días</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Pre-registro</div>
                                                        <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>👥 156</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Dificultad</div>
                                                        <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>⭐⭐</div>
                                                    </div>
                                                </div>

                                                <button style={{
                                                    backgroundColor: '#f59e0b',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '6px',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer'
                                                }}>
                                                    Pre-registrarse
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Panel lateral */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* Mis trofeos */}
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            color: '#374151',
                                            marginBottom: '1rem'
                                        }}>
                                            🏆 Mis Trofeos
                                        </h3>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem',
                                                backgroundColor: '#fef3c7',
                                                borderRadius: '8px'
                                            }}>
                                                <div style={{ fontSize: '1.5rem' }}>🥇</div>
                                                <div>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Primer Lugar</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Concurso de Fantasía</div>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem',
                                                backgroundColor: '#e5e7eb',
                                                borderRadius: '8px'
                                            }}>
                                                <div style={{ fontSize: '1.5rem' }}>🥈</div>
                                                <div>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Segundo Lugar</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Historias Cortas</div>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem',
                                                backgroundColor: '#fed7aa',
                                                borderRadius: '8px'
                                            }}>
                                                <div style={{ fontSize: '1.5rem' }}>🥉</div>
                                                <div>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Tercer Lugar</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Ciencia Ficción</div>
                                                </div>
                                            </div>
                                        </div>

                                        <button style={{
                                            width: '100%',
                                            marginTop: '1rem',
                                            padding: '0.5rem',
                                            backgroundColor: '#f3f4f6',
                                            color: '#374151',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            cursor: 'pointer'
                                        }}>
                                            Ver Todos los Trofeos
                                        </button>
                                    </div>

                                    {/* Ranking */}
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            color: '#374151',
                                            marginBottom: '1rem'
                                        }}>
                                            📊 Ranking Global
                                        </h3>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.5rem 0'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '1.2rem' }}>🥇</span>
                                                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>María González</span>
                                                </div>
                                                <span style={{ fontSize: '0.875rem', color: '#10b981' }}>2,450 pts</span>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.5rem 0'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '1.2rem' }}>🥈</span>
                                                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Carlos Ruiz</span>
                                                </div>
                                                <span style={{ fontSize: '0.875rem', color: '#10b981' }}>2,180 pts</span>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.5rem 0'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '1.2rem' }}>🥉</span>
                                                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Ana López</span>
                                                </div>
                                                <span style={{ fontSize: '0.875rem', color: '#10b981' }}>1,890 pts</span>
                                            </div>

                                            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '0.5rem 0',
                                                    backgroundColor: '#eff6ff',
                                                    borderRadius: '6px',
                                                    paddingLeft: '0.75rem',
                                                    paddingRight: '0.75rem'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>#25</span>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6' }}>Tú</span>
                                                    </div>
                                                    <span style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: '600' }}>756 pts</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Próximos concursos */}
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            color: '#374151',
                                            marginBottom: '1rem'
                                        }}>
                                            📅 Próximos Eventos
                                        </h3>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div style={{
                                                borderLeft: '3px solid #3b82f6',
                                                paddingLeft: '0.75rem'
                                            }}>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Maratón de Escritura</div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>15 Oct - 72 horas continuas</div>
                                            </div>

                                            <div style={{
                                                borderLeft: '3px solid #10b981',
                                                paddingLeft: '0.75rem'
                                            }}>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Workshop de Narrativa</div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>22 Oct - Masterclass gratuita</div>
                                            </div>

                                            <div style={{
                                                borderLeft: '3px solid #f59e0b',
                                                paddingLeft: '0.75rem'
                                            }}>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Concurso Halloween</div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>31 Oct - Historias de terror</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentPage === 'perfil' && (
                        <ProfilePage
                            user={user}
                            onBack={() => changePage('inicio')}
                            updateProfile={updateProfile}
                        />
                    )}

                    {currentPage === 'configuracion' && (
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: '2.5rem', color: '#6b7280', marginBottom: '1rem' }}>
                                ⚙️ Configuración
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                                Ajusta tu cuenta y preferencias
                            </p>
                        </div>
                    )}

                    {currentPage === 'settings' && (
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: '2.5rem', color: '#6b7280', marginBottom: '1rem' }}>
                                ⚙️ Configuración
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                                Ajusta tu cuenta y preferencias
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f9fafb'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                    <div style={{ fontSize: '1.2rem', color: '#6b7280' }}>Cargando...</div>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

// Main App Component
function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
