// Sistema de autenticación StoryUp - Usuarios exactos especificados

// Base de datos de usuarios StoryUp
const storyupUsers = [
    {
        id: '1',
        username: 'PIPO68',
        email: 'pipocanarias@hotmail.com',
        name: 'PIPO68',
        role: 'admin', // Usuario y Admin
        password: 'pipo123',
        avatar: '/assets/logo-grande.png.png',
        likes: 0,
        trophies: [],
        friends: [],
        isOnline: true
    },
    {
        id: '2',
        username: 'piporgz68',
        email: 'piporgz68@gmail.com',
        name: 'piporgz68',
        role: 'teacher', // Padre/Docente
        password: 'teacher123',
        avatar: '/assets/logo-grande.png.png',
        likes: 0,
        trophies: [],
        friends: [],
        isOnline: false
    }
];

// Obtener el usuario actual desde el token almacenado
export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) return null;

        const userData = localStorage.getItem('user_data');
        if (userData) {
            return JSON.parse(userData);
        }

        return null;
    } catch (error) {
        console.error('Error obteniendo usuario actual:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        return null;
    }
};

// Login de usuario StoryUp
export const loginUser = async (credentials: { email: string; password: string }) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!credentials.email || !credentials.password) {
            throw new Error('Email y contraseña son requeridos');
        }

        // Buscar usuario en la base de datos StoryUp
        const user = storyupUsers.find(u =>
            u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
            throw new Error('Credenciales incorrectas');
        }

        // Marcar usuario como online
        user.isOnline = true;

        const token = 'storyup_token_' + user.id + '_' + Date.now();
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));

        return user;
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
};

// Registro de usuario StoryUp (solo los 2 usuarios permitidos)
export const registerUser = async (credentials: { email: string; password: string }) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!credentials.email || !credentials.password) {
            throw new Error('Email y contraseña son requeridos');
        }

        // Buscar usuario en la base de datos StoryUp
        const user = storyupUsers.find(u => u.email === credentials.email);

        if (!user) {
            throw new Error('Usuario no registrado en StoryUp');
        }

        if (user.password !== credentials.password) {
            throw new Error('Contraseña incorrecta');
        }

        // Marcar usuario como online
        user.isOnline = true;

        const token = 'storyup_token_' + user.id + '_' + Date.now();
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));

        return user;
    } catch (error) {
        console.error('Error en registro:', error);
        throw error;
    }
};

// Logout
export const logoutUser = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = '/';
};

// Actualizar datos del usuario (simulado)
export const updateUser = async (updates: Partial<any>) => {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('No autorizado');

        // Simular actualización
        await new Promise(resolve => setTimeout(resolve, 500));

        // Obtener datos actuales del usuario
        const currentUserData = localStorage.getItem('user_data');
        if (!currentUserData) throw new Error('Usuario no encontrado');

        const currentUser = JSON.parse(currentUserData);
        const updatedUser = { ...currentUser, ...updates };

        // Guardar datos actualizados
        localStorage.setItem('user_data', JSON.stringify(updatedUser));

        return updatedUser;
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        throw error;
    }
};

// Obtener token para requests autenticados
export const getAuthToken = () => {
    return localStorage.getItem('auth_token');
};

// Obtener estadísticas de usuarios StoryUp
export const getUserStats = () => {
    const totalUsers = storyupUsers.length; // 2 usuarios inscritos
    const onlineUsers = storyupUsers.filter(u => u.isOnline).length; // Solo 1 en línea

    return {
        totalUsers,
        onlineUsers,
        users: storyupUsers
    };
};

// Obtener todos los usuarios (para administración)
export const getAllUsers = () => {
    return storyupUsers;
};