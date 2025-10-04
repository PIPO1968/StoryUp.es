// Sistema de autenticación StoryUp - Registro público abierto

// Base de datos de usuarios StoryUp (almacenada en localStorage)
export const getStoredUsers = () => {
    const users = localStorage.getItem('storyup_users');
    if (users) {
        return JSON.parse(users);
    }

    // Si no hay usuarios, crear el administrador por defecto
    const defaultUsers = [
        {
            id: '1',
            username: 'admin',
            email: 'admin@storyup.es',
            name: 'Administrador',
            role: 'admin',
            password: 'admin123',
            avatar: '/favicon.ico',
            likes: 0,
            trophies: [],
            friends: [],
            isOnline: false,
            createdAt: new Date().toISOString()
        }
    ];

    // Guardar el usuario por defecto
    saveUsers(defaultUsers);
    return defaultUsers;
};

const saveUsers = (users: any[]) => {
    localStorage.setItem('storyup_users', JSON.stringify(users));
};

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

        const users = getStoredUsers();

        // Buscar usuario por email o username
        const user = users.find(u =>
            (u.email === credentials.email || u.username === credentials.email) &&
            u.password === credentials.password
        );

        if (!user) {
            throw new Error('Credenciales incorrectas');
        }

        // Marcar usuario como online
        user.isOnline = true;
        saveUsers(users);

        const token = 'storyup_token_' + user.id + '_' + Date.now();
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));

        return user;
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
};

// Registro de usuario StoryUp (público y abierto)
export const registerUser = async (userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    role?: string;
}) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!userData.username || !userData.email || !userData.password || !userData.name) {
            throw new Error('Todos los campos son requeridos');
        }

        const users = getStoredUsers();

        // Verificar si ya existe el usuario
        const existingUserByEmail = users.find(u => u.email === userData.email);
        const existingUserByUsername = users.find(u => u.username === userData.username);

        if (existingUserByEmail) {
            console.log('Email ya registrado:', userData.email);
            throw new Error(`El email ${userData.email} ya está registrado`);
        }

        if (existingUserByUsername) {
            console.log('Username ya registrado:', userData.username);
            throw new Error(`El usuario ${userData.username} ya está registrado`);
        }

        // Crear nuevo usuario
        const newUser = {
            id: (users.length + 1).toString(),
            username: userData.username,
            email: userData.email,
            name: userData.name,
            password: userData.password,
            role: userData.role || 'user', // Usar el rol seleccionado o 'user' por defecto
            avatar: '/favicon.ico',
            likes: 0,
            trophies: [],
            friends: [],
            isOnline: true,
            createdAt: new Date().toISOString()
        };

        // Agregar usuario a la lista
        users.push(newUser);
        saveUsers(users);

        // Marcar como logueado
        const token = 'storyup_token_' + newUser.id + '_' + Date.now();
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(newUser));

        return newUser;
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
    const users = getStoredUsers();
    const totalUsers = users.length;
    const onlineUsers = users.filter(u => u.isOnline).length;

    return {
        totalUsers,
        onlineUsers,
        users
    };
};

// Obtener todos los usuarios (para administración)
export const getAllUsers = () => {
    return getStoredUsers();
};